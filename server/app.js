const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const okResult = (res, data = {}) => {
    res.json({result: true, data});
};

const errorResult = (res, message, data = {}) => {
    res.json({result: false, message, data});
};

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

app.get('/feed/get', (req, res) => {
    okResult(res);
});

app.put('/feed/add', (req, res) => {
    okResult(res);
});

app.delete('/feed/delete', (req, res) => {
    okResult(res);
});

app.get('/test', (req, res) => {
    okResult(res);
});

app.use((err, req, res, next) => {
    console.log('I run on every request!');
    if (err) console.error(err)
    res.status(403).send('Request body was not signed or verification failed')
})

module.exports = app;
