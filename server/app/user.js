const {fairOSTest} = require("./utils");
const {errorResult} = require("./utils");
const {okResult} = require("./utils");

module.exports = function (app) {
    app.post('/user/login', async (req, res) => {
        const {username, password} = req.body;
        if (username && password) {
            const response = await fairOSTest.userLogin(username, password);
            console.log(response);
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
            const response = await fairOSTest.userSignup(username, password, mnemonic);
            console.log(response);
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

