const {getFriendFeedName} = require("./utils");
const {friendNamePrefix} = require("./utils");
const {feedNamePrefix} = require("./utils");
const {errorResult} = require("./utils");
const {okResult, fairOS, appPod, getNewFeedName, feedFilename} = require("./utils");

module.exports = function (app) {
    // get user combined feed
    // app.get('/feed', async (req, res) => {
    //     const {password} = req.body;
    //     const openResult = await fairOS.podOpen(appPod, password);
    //     console.log(openResult);
    //     okResult(res);
    // });

    app.post('/feed/friend/get', async (req, res) => {
        const {username, password} = req.body;

        if (username && password) {
            await fairOS.userLogin(username, password);
            const list = await fairOS.podLs();
            const filtered = list?.shared_pod_name.filter(item => item.startsWith(friendNamePrefix));
            let result = [];
            if (filtered.length > 0) {
                for (let i = 0; i <= filtered.length; i++) {
                    let files = await fairOS.podLs();
                    console.log(files);
                }
            }

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
            console.log(info);
            await fairOS.podReceive(reference);

            okResult(res, result);
        } else {
            errorResult(res, 'Some params missed');
        }
    });

    app.post('/feed/friend/init', async (req, res) => {
        const {username, password} = req.body;

        if (username && password) {
            await fairOS.userLogin(username, password);
            const list = await fairOS.podLs();
            const filtered = list?.pod_name.filter(item => item.startsWith(friendNamePrefix));

            let created = false;
            let name = '';
            if (filtered.length === 0) {
                name = getFriendFeedName();
                await fairOS.podNew(name, password);
                created = true;
            }

            okResult(res, {created, name});
        } else {
            errorResult(res, 'Some params missed');
        }
    });

    // create feed for authors
    app.post('/feed/new', async (req, res) => {
        const {username, password, content} = req.body;

        if (username && password && content) {
            await fairOS.userLogin(username, password);
            const feedName = getNewFeedName();
            await fairOS.podNew(feedName, password);
            // we should relogin because fairOS 0.5.2 bug
            await fairOS.userLogin(username, password);
            await fairOS.podOpen(feedName, password);
            await fairOS.fileUpload(content, feedFilename, feedName);
            // we should relogin because fairOS 0.5.2 bug
            await fairOS.userLogin(username, password);
            const result = await fairOS.podShare(feedName, password);
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

