const {okResult} = require("./utils");

module.exports = function (app) {
    app.get('/feed', (req, res) => {
        okResult(res);
    });

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

