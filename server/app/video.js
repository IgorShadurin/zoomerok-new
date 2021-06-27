const {errorResult} = require("./utils");
const {okResult} = require("./utils");

module.exports = function (app) {
    app.get('/video/download', (req, res) => {
        const {feedId, videoId} = req.body;
        // todo check is logged in
        if (feedId && videoId) {
            // todo download video by fairos api
            okResult(res);
        } else {
            errorResult(res, 'feedId or videoId is empty');
        }
    });

    app.post('/video/upload', (req, res) => {
        // todo check is logged in
        const {sharedFeedIds} = req.body;
        // todo send shared video to feedId source
        // if (username && password && seed) {
        //     okResult(res);
        // } else {
        //     errorResult(res, 'Username, password or seed not found');
        // }
    });

    app.delete('/video/delete', (req, res) => {
        // todo check is logged in
        // todo how to delete shared video?
        const {feedId, videoId} = req.body;
        // todo check is user own video
        if (feedId && videoId) {
            // todo delete video from my pod
            okResult(res);
        } else {
            errorResult(res, 'feedId or videoId is empty');
        }
    });
}

