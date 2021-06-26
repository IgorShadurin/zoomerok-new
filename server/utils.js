module.exports.okResult = (res, data = {}) => {
    res.json({result: true, data});
};

module.exports.errorResult = (res, message, data = {}) => {
    res.json({result: false, message, data});
};
