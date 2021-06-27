const FairOS = require('../lib/FairOSNode');
/**
 *
 * @type {null|FairOS}
 */
let fairOSInstance = null;

module.exports.okResult = (res, data = {}) => {
    res.json({result: true, data});
};

module.exports.errorResult = (res, message, data = {}) => {
    res.json({result: false, message, data});
};

/**
 *
 * @type {FairOS}
 */
module.exports.fairOS = fairOSInstance ? fairOSInstance : (
    // todo insert var from env
    fairOSInstance = new FairOS('http://localhost:9099/v1/'),
        fairOSInstance
);
