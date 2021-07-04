const FairOS = require('../lib/FairOSNode');
/**
 *
 * @type {null|FairOS}
 */
// let fairOSTestInstance = null;
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
// module.exports.fairOSTest = fairOSTestInstance ? fairOSTestInstance : (
//     // todo insert var from env
//     fairOSTestInstance = new FairOS('http://raspberrypi.local:9099/v1/'),
//         fairOSTestInstance
// );

/**
 *
 * @type {FairOS}
 */
module.exports.fairOS = fairOSInstance ? fairOSInstance : (
    // todo insert var from env
    // fairOSTestInstance = new FairOS('http://localhost:9099/v1/'),
    // fairOSTestInstance = new FairOS('http://raspberrypi.local:9099/v1/'),
    fairOSTestInstance = new FairOS('http://raspberrypi.local:9099/v0/'),
        fairOSTestInstance
);

module.exports.uuid = () => {
    return 'xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

module.exports.feedFilename = 'feed.json';

module.exports.appPod = 'Zoomerok';

module.exports.getNewFeedName = () => {
    const uuid = module.exports.uuid();
    return `Zoo-feed-${uuid}`;
};

module.exports.getNewFeedFileName = () => {
    const uuid = module.exports.uuid() + module.exports.uuid() + module.exports.uuid();
    return `feed-${uuid}.json`;
};
