const {errorResult} = require("./utils");
const {okResult, fairOS, appPod, getNewFeedName, feedFilename} = require("./utils");

module.exports = function (app) {
    // get user combined feed
    app.get('/feed', async (req, res) => {
        const {password} = req.body;
        const openResult = await fairOS.podOpen(appPod, password);
        console.log(openResult);
        okResult(res);
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
            okResult(res, result.pod_sharing_reference);
        } else {
            errorResult(res, 'Some params missed');
        }
    });

    // app.get('/feed/update', async (req, res) => {
    //     const {password, content, feedName} = req.body;
    //     await fairOS.podOpen(feedName, password);
    //     await fairOS.fileUpload(content, feedFilename, feedName);
    //     okResult(res);
    // });

    app.get('/feed/source', (req, res) => {
        okResult(res);
    });

    app.post('/feed/source/add', (req, res) => {
        okResult(res);
    });

    app.delete('/feed/source/delete', (req, res) => {
        okResult(res);
    });
}

