const {errorResult} = require("./utils");
const {okResult} = require("./utils");

module.exports = function (app) {
    app.post('/user/login', (req, res) => {
        okResult(res);
    });

    app.post('/user/new', (req, res) => {
        const {username, password, seed} = req.body;
        if (username && password && seed) {
            okResult(res);
        } else {
            errorResult(res, 'Username, password or seed not found');
        }
    });
}

