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
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const tmp = require('tmp');

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

    async function createPublicPod(username, password) {
        let name = getFriendFeedName();
        const address = (await fairOS.userStat()).reference;
        await fairOS.podNew(name, password);
        await fairOS.userLogin(username, password);
        const sharedResult = await fairOS.podShare(name, password);
        const reference = sharedResult.pod_sharing_reference;

        return {name, reference};
    }

    app.post('/feed/friend/init', async (req, res) => {
        const {username, password} = req.body;

        if (username && password) {
            await fairOS.userLogin(username, password);
            const list = await fairOS.podLs();
            const pod = list?.pod_name.find(item => item.startsWith(friendNamePrefix));
            if (pod) {
                errorResult(res, 'Already added');
            } else {
                const {name, reference} = await createPublicPod(username, password);
                okResult(res, {name, reference});
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
                    const entries = (files.entries ? files.entries.filter(item => item.name.endsWith('.mp4')).sort().reverse() : []).slice(0, maxItemsFromUser);
                    // const key = getRedisPodOwnerKey(currentPod);
                    // console.log('redis get key', key);
                    // let address = await client.get(key);
                    // console.log('redis received address', address);
                    // if (!(typeof address === 'string' && address.length === 42)) {
                    //     // todo get data from fairos & cache it
                    //     throw new Error("Address not received");
                    // }
                    const nameDescription = {};
                    for (let item of entries) {
                        let info = await fairOS.fileDownload(currentPod, `${item.name}.json`);
                        // todo check is json for cases whe user uploaded video manually
                        if (info) {
                            info = JSON.parse(info);
                            nameDescription[item.name] = info;
                        } else {
                            nameDescription[item.name] = {};
                        }
                    }

                    entries.forEach(item => result.push({
                        pod: currentPod,
                        name: item.name,
                        previewName: `${item.name}.jpg`,
                        ...nameDescription[item.name]
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
            const entries = (files.entries ? files.entries.filter(item => item.name.endsWith('.mp4')).sort().reverse() : [])
                .slice(0, maxItemsFromUser);

            const nameDescription = {};
            for (let item of entries) {
                let info = await fairOS.fileDownload(pod, `${item.name}.json`);
                // todo check is json for cases whe user uploaded video manually
                if (info) {
                    info = JSON.parse(info);
                    nameDescription[item.name] = info;
                } else {
                    nameDescription[item.name] = {};
                }
            }

            // todo implement paginator for videos?
            entries.forEach(item => result.push({
                pod: pod,
                name: item.name,
                previewName: `${item.name}.jpg`,
                ...nameDescription[item.name]
            }));

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
        {name: 'password'},
        {name: 'description'}
    ]), async (req, res) => {
        const {username, password, description = ''} = req.body;

        if (!(username && password)) {
            errorResult(res, 'Some params missed');
            return;
        }

        const maxMb = 100;
        const video = req.files.video[0];
        let videoBuffer = video.buffer;
        // console.log('req.files', req.files);
        if (video.size > maxMb * 1024 * 1024) {
            errorResult(res, `File too big. Max size is ${maxMb} Mb`);

            return;
        }

        const tmpVideoPath = tmp.tmpNameSync();
        const tmpVideoPreviewPath = `${tmpVideoPath}.jpg`;
        let tmpOutputPath = '';
        fs.writeFileSync(tmpVideoPath, video.buffer);

        const cmd = `ffmpeg -i "${tmpVideoPath}" -q:v 15 -vframes 1 "${tmpVideoPreviewPath}"`;
        await exec(cmd);

        if (video.mimetype.indexOf('quicktime') !== -1) {
            tmpOutputPath = `${tmpVideoPath}.mp4`
            const cmd = `ffmpeg -i "${tmpVideoPath}" "${tmpOutputPath}"`;
            await exec(cmd);
            fs.unlinkSync(tmpVideoPath);
            if (!fs.existsSync(tmpOutputPath)) {
                errorResult(res, `Can't convert video file to mp4. Output file not found`);

                return;
            }

            videoBuffer = fs.readFileSync(tmpOutputPath);
        }

        await fairOS.userLogin(username, password);
        // const userInfo = await fairOS.userStat();
        let pod = '';
        const list = await fairOS.podLs();
        const filtered = list?.pod_name.filter(item => item.startsWith(friendNamePrefix));
        if (filtered.length === 0) {
            const {name} = await createPublicPod(username, password);
            await fairOS.userLogin(username, password);
            pod = name;
        } else {
            pod = filtered[0];
        }

        await fairOS.podOpen(pod, password);
        const videoFileName = getNewVideoFileName();
        const videoDescriptionFileName = `${videoFileName}.json`;
        const previewFileName = `${videoFileName}.jpg`;

        const response = await fairOS.fileUpload(videoBuffer, videoFileName, pod);
        const fileName = response?.References[0]?.file_name;
        const reference = response?.References[0]?.reference;
        if (reference) {
            const previewBuffer = fs.readFileSync(tmpVideoPreviewPath);
            saveVideoToStatic(pod, fileName, videoBuffer);
            saveVideoToStatic(pod, previewFileName, previewBuffer);
            // upload preview
            await fairOS.fileUpload(previewBuffer, previewFileName, pod);
            // upload meta
            await fairOS.fileUpload(JSON.stringify({
                username,
                description
            }), videoDescriptionFileName, pod);

            // clear tmp
            [tmpVideoPreviewPath, tmpVideoPath, tmpOutputPath].forEach(item => {
                if (item && fs.existsSync(item)) {
                    fs.unlinkSync(item);
                }
            });

            okResult(res, {reference, name: fileName});
        } else {
            errorResult(res, 'File not uploaded');
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

