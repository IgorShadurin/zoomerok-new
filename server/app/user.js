const {fairOS} = require("./utils");
const {errorResult} = require("./utils");
const {okResult} = require("./utils");

module.exports = function (app) {
    app.post('/user/login', async (req, res) => {
        const {username, password} = req.body;
        if (!(username && password)) {
            errorResult(res, 'Username or password is not correct');
            return;
        }

        let response;
        try {
            response = (await fairOS.userLogin(username, password)).data;
        } catch (e) {

        }

        if (response?.code === 200) {
            okResult(res);
        } else {
            errorResult(res, 'Can\'t login with credentials');
        }
    });

    app.post('/user/new', async (req, res) => {
        const {username, password, mnemonic = ''} = req.body;
        if (!(username && password)) {
            errorResult(res, 'Username, password or seed not found');
            return;
        }

        let response;
        try {
            response = (await fairOS.userSignup(username, password, mnemonic)).data;
        } catch (e) {

        }

        if (response?.address) {
            okResult(res, response);
        } else {
            errorResult(res, 'Can\'t signup with credentials');
        }
    });
}

