const {
    saveVideoToStatic,
    errorResult,
    getFriendFeedName,
    getNewVideoFileName,
    friendNamePrefix,
    feedNamePrefix,
    okResult,
    fairOS,
    getNewFeedName,
    feedFilename,
    getRedisPodOwnerKey
} = require("./utils");
const multer = require('multer');
const fs = require('fs');
const upload = multer();
// const asyncRedis = require("async-redis");
// const client = asyncRedis.createClient();

module.exports = function (app) {
    // get user combined feed
    // app.get('/feed', async (req, res) => {
    //     const {password} = req.body;
    //     const openResult = await fairOS.podOpen(appPod, password);
    //     console.log(openResult);
    //     okResult(res);
    // });

    // async function cachePodOwner(pod, owner) {
    //     const redisKey = getRedisPodOwnerKey(pod);
    //     console.log('redisKey', redisKey, 'redis value', owner.toLowerCase());
    //     await client.set(redisKey, owner.toLowerCase());
    // }

    app.post('/feed/friend/init', async (req, res) => {
        const {username, password} = req.body;

        if (username && password) {
            await fairOS.userLogin(username, password);
            const list = await fairOS.podLs();
            const pod = list?.pod_name.find(item => item.startsWith(friendNamePrefix));
            let created = false;
            let name = '';
            let reference = '';
            if (pod) {
                errorResult(res, 'Already added');
            } else {
                name = getFriendFeedName();
                const address = (await fairOS.userStat()).reference;
                await fairOS.podNew(name, password);
                await fairOS.userLogin(username, password);
                const sharedResult = await fairOS.podShare(name, password);
                reference = sharedResult.pod_sharing_reference;
                created = true;
                // await cachePodOwner(name, address);
                okResult(res, {created, name, reference});
            }
        } else {
            errorResult(res, 'Some params missed');
        }
    });

    app.post('/feed/friend/get-my-pod-name', async (req, res) => {
        const {username, password} = req.body;

        if (username && password) {
            await fairOS.userLogin(username, password);
            const list = await fairOS.podLs();
            const pod = list?.pod_name.find(item => item.startsWith(friendNamePrefix));
            if (pod) {
                okResult(res, pod);
            } else {
                errorResult(res, 'Feed not created');
            }
        } else {
            errorResult(res, 'Some params missed');
        }
    });

    app.post('/feed/friend/get-my-reference', async (req, res) => {
        const {username, password} = req.body;

        if (username && password) {
            await fairOS.userLogin(username, password);
            const list = await fairOS.podLs();
            const pod = list?.pod_name.find(item => item.startsWith(friendNamePrefix));
            if (pod) {
                const sharedResult = await fairOS.podShare(pod, password);
                okResult(res, sharedResult.pod_sharing_reference);
            } else {
                errorResult(res, 'Feed not created');
            }
        } else {
            errorResult(res, 'Some params missed');
        }
    });

    app.post('/feed/friend/list', async (req, res) => {
        const {username, password} = req.body;

        if (username && password) {
            await fairOS.userLogin(username, password);
            const list = await fairOS.podLs();
            const filtered = list?.shared_pod_name.filter(item => item.startsWith(friendNamePrefix));

            okResult(res, filtered);
        } else {
            errorResult(res, 'Some params missed');
        }
    });

    app.post('/feed/friend/get-videos', async (req, res) => {
        const {username, password} = req.body;

        const maxItemsFromUser = 10;
        if (username && password) {
            await fairOS.userLogin(username, password);
            const list = await fairOS.podLs();
            const filtered = list?.shared_pod_name.filter(item => item.startsWith(friendNamePrefix));
            let result = [];
            if (filtered.length > 0) {
                for (let i = 0; i < filtered.length; i++) {
                    const currentPod = filtered[i];
                    await fairOS.podOpen(currentPod, password);
                    let files = await fairOS.dirLs(currentPod);
                    const entries = (files.entries ? files.entries.sort().reverse() : []).slice(0, maxItemsFromUser);
                    // const key = getRedisPodOwnerKey(currentPod);
                    // console.log('redis get key', key);
                    // let address = await client.get(key);
                    // console.log('redis received address', address);
                    // if (!(typeof address === 'string' && address.length === 42)) {
                    //     // todo get data from fairos & cache it
                    //     throw new Error("Address not received");
                    // }

                    entries.forEach(item => result.push({
                        pod: currentPod,
                        name: item.name,
                        // address
                    }));
                }
            }

            okResult(res, result);
        } else {
            errorResult(res, 'Some params missed');
        }
    });

    app.post('/feed/friend/get-my-videos', async (req, res) => {
        const {username, password} = req.body;

        const maxItemsFromUser = 100;
        if (username && password) {
            await fairOS.userLogin(username, password);
            const list = await fairOS.podLs();
            const filtered = list?.pod_name.filter(item => item.startsWith(friendNamePrefix));
            const pod = filtered.length > 0 ? filtered[0] : null;
            let result = [];
            await fairOS.podOpen(pod, password);
            let files = await fairOS.dirLs(pod);
            const entries = (files.entries ? files.entries.sort().reverse() : []).slice(0, maxItemsFromUser);
            entries.forEach(item => result.push({pod: pod, name: item.name}));

            okResult(res, result);
        } else {
            errorResult(res, 'Some params missed');
        }
    });

    app.post('/feed/friend/add', async (req, res) => {
        const {username, password, reference} = req.body;

        if (username && password && reference) {
            if (reference.length !== 128) {
                errorResult(res, 'Incorrect reference passed');
                return;
            }

            await fairOS.userLogin(username, password);
            const info = await fairOS.podReceiveInfo(reference);
            await fairOS.podReceive(reference);

            okResult(res, {name: info.pod_name});
        } else {
            errorResult(res, 'Some params missed');
        }
    });

    app.post('/feed/friend/upload', upload.fields([
        {name: 'video', maxCount: 1},
        {name: 'username'},
        {name: 'password'}
    ]), async (req, res) => {
        const {username, password} = req.body;

        const maxMb = 100;
        const video = req.files.video[0];
        if (video.size > maxMb * 1024 * 1024) {
            errorResult(res, `File too big. Max size is ${maxMb} Mb`);

            return;
        }

        if (username && password) {
            await fairOS.userLogin(username, password);
            // const userInfo = await fairOS.userStat();
            const list = await fairOS.podLs();
            const filtered = list?.pod_name.filter(item => item.startsWith(friendNamePrefix));
            if (filtered.length === 0) {
                errorResult(res, 'Public feed not found');

                return;
            }

            const pod = filtered[0];
            await fairOS.podOpen(pod, password);
            const response = await fairOS.fileUpload(video.buffer, getNewVideoFileName(), pod);
            const fileName = response?.References[0]?.file_name;
            const reference = response?.References[0]?.reference;
            if (reference) {
                // saveVideoToStatic(userInfo.reference, pod, fileName, video.buffer);
                saveVideoToStatic(pod, fileName, video.buffer);
                okResult(res, {reference, name: fileName});
            } else {
                errorResult(res, 'File not uploaded');
            }
        } else {
            errorResult(res, 'Some params missed');
        }
    });

    // create feed for authors
    app.post('/feed/new', async (req, res) => {
        const {username, password, content} = req.body;

        if (username && password && content) {
            await fairOS.userLogin(username, password);
            const address = (await fairOS.userStat()).reference;
            const feedName = getNewFeedName();
            await fairOS.podNew(feedName, password);
            // we should relogin because fairOS 0.5.2 bug
            await fairOS.userLogin(username, password);
            await fairOS.podOpen(feedName, password);
            await fairOS.fileUpload(content, feedFilename, feedName);
            // we should relogin because fairOS 0.5.2 bug
            await fairOS.userLogin(username, password);
            const result = await fairOS.podShare(feedName, password);
            // await cachePodOwner(feedName, address);
            okResult(res, {
                name: feedName,
                reference: result.pod_sharing_reference
            });
        } else {
            errorResult(res, 'Some params missed');
        }
    });

    // get feed content
    app.post('/feed/get-content', async (req, res) => {
        const {username, password, reference, isReceive = true} = req.body;

        if (username && password && reference) {
            if (reference.length !== 128) {
                errorResult(res, 'Incorrect reference passed');
                return;
            }

            await fairOS.userLogin(username, password);
            const info = await fairOS.podReceiveInfo(reference);
            const podName = info.pod_name;
            if (isReceive) {
                await fairOS.podReceive(reference);
            }

            await fairOS.podOpen(podName, password);
            const content = await fairOS.fileDownload(podName, feedFilename);

            okResult(res, content);
        } else {
            errorResult(res, 'Some params missed');
        }
    });

    app.post('/feed/update', async (req, res) => {
        const {username, password, content, feedName} = req.body;

        if (username && password && content && feedName) {
            try {
                await fairOS.userLogin(username, password);
                // todo validate if pod exists
                await fairOS.podOpen(feedName, password);
                await fairOS.fileDelete(content, feedFilename);
                await fairOS.userLogin(username, password);
                await fairOS.podOpen(feedName, password);
                await fairOS.fileUpload(content, feedFilename, feedName);

                okResult(res);
            } catch (e) {
                errorResult(res, e.message);
            }
        } else {
            errorResult(res, 'Some params missed');
        }
    });

    app.post('/feed/source/get', async (req, res) => {
        const {username, password} = req.body;

        if (username && password) {
            await fairOS.userLogin(username, password);
            const list = await fairOS.podLs();
            const filtered = list?.shared_pod_name.filter(item => item.startsWith(feedNamePrefix));

            okResult(res, filtered);
        } else {
            errorResult(res, 'Some params missed');
        }
    });

    app.post('/feed/source/add', async (req, res) => {
        const {username, password, reference} = req.body;

        if (username && password && reference) {
            if (reference.length !== 128) {
                errorResult(res, 'Incorrect reference passed');
                return;
            }

            await fairOS.userLogin(username, password);
            await fairOS.podReceive(reference);

            okResult(res);
        } else {
            errorResult(res, 'Some params missed');
        }
    });

    // app.post('/feed/test', async (req, res) => {
    //     const {username, password} = req.body;
    //
    //     if (username && password) {
    //         let data = await fairOS.userLogin(username, password);
    //         console.log(data);
    //         data = await fairOS.userStat();
    //         console.log(data);
    //
    //         okResult(res);
    //     } else {
    //         errorResult(res, 'Some params missed');
    //     }
    // });

    // to implement deleting we should store "deleted" pods in Zoomerok pod
    // app.delete('/feed/source/delete', async (req, res) => {
    //     const {username, password, id} = req.body;
    //
    //     if (username && password && id) {
    //         okResult(res);
    //     } else {
    //         errorResult(res, 'Some params missed');
    //     }
    // });
}

