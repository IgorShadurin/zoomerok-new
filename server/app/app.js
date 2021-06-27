const express = require('express');
const bodyParser = require('body-parser');
const {okResult} = require("./utils");

const app = express();

app.use(function (req, res, next) {
    console.log(`[${Date.now()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.use(bodyParser.json({
    verify: (req, res, buf, encoding) => {
        if (buf && buf.length) {
            req.rawBody = buf.toString(encoding || 'utf8');
        }
    },
}));

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
