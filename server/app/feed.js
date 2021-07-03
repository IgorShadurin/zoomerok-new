const {okResult, fairOS, appPod, getNewFeedName, feedFilename} = require("./utils");

module.exports = function (app) {
    app.get('/feed', async (req, res) => {
        const {password} = req.body;
        const openResult = await fairOS.podOpen(appPod, password);
        console.log(openResult);
        okResult(res);
    });

    app.get('/feed/new', async (req, res) => {
        const {password, content} = req.body;
        const feedName = getNewFeedName();
        await fairOS.podNew(feedName, password);
        await fairOS.podOpen(feedName, password);
        await fairOS.fileUpload(content, feedFilename, feedName);
        okResult(res);
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

