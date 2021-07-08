const {fairOS} = require("./utils");
const {errorResult} = require("./utils");
const {okResult} = require("./utils");

module.exports = function (app) {
    app.post('/user/login', async (req, res) => {
        const {username, password} = req.body;
        if (username && password) {
            const response = await fairOS.userLogin(username, password);
            if (response.code === 200) {
                okResult(res);
            } else {
                errorResult(res, 'Can\'t login with credentials');
            }
        } else {
            errorResult(res, 'Username or password is not correct');
        }
    });

    app.post('/user/new', async (req, res) => {
        const {username, password, mnemonic} = req.body;
        if (username && password && mnemonic) {
            const response = await fairOS.userSignup(username, password, mnemonic);
            if (response.address) {
                okResult(res);
            } else {
                errorResult(res, 'Can\'t signup with credentials');
            }
        } else {
            errorResult(res, 'Username, password or seed not found');
        }
    });
}

