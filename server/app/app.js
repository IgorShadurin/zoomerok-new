const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const {okResult} = require("./utils");
require('dotenv').config({path: '../.env'});

function validateEnv() {
    const staticPath = process.env.APP_STATIC_VIDEO_PATH;
    if (!(staticPath && fs.existsSync(staticPath))) {
        throw new Error(`Video path not exists: ${staticPath}, ${process.env.PWD}`);
    }

    try {
        const testFile = `${staticPath}/test.txt`;
        if (fs.existsSync(testFile)) {
            fs.rmSync(testFile);
        }

        fs.writeFileSync(testFile, 'Some data');
        fs.rmSync(testFile);
    } catch (e) {
        throw new Error(`Static dir is not writable? ${e.message}`);
    }
}

validateEnv();

const app = express();

app.use(function (req, res, next) {
    console.log(`[${Date.now()}] ${req.method} ${req.originalUrl}`);
    next();
});

const bodyParse = bodyParser.json();

app.use((req, res, next) => {
    if (req.originalUrl === '/feed/friend/upload') next();
    else bodyParse(req, res, next);
});

require('./user')(app);
require('./feed')(app);

app.get('/test', (req, res) => {
    okResult(res);
});

app.use((err, req, res, next) => {
    // console.log('I run on every request!');
    if (err) console.error(err)
    res.status(403).send(`Some error happened`)
})

module.exports = app;
