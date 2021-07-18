const FairOS = require('../lib/FairOSNode');
const fs = require('fs');

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

module.exports.redisPrefix = 'zoomerok:';

module.exports.redisPodOwnerKey = 'pod_owner';

module.exports.getRedisPodOwnerKey = (pod) => {
    return `${module.exports.redisPrefix}${module.exports.redisPodOwnerKey}:${pod.toLowerCase()}`;
};

module.exports.feedFilename = 'feed.json';

module.exports.appPod = 'Zoomerok';

module.exports.feedNamePrefix = 'Zoo-feed-';

module.exports.friendNamePrefix = 'Zoo-friend-';

module.exports.getNewFeedName = () => {
    const uuid = module.exports.uuid();
    return `${module.exports.feedNamePrefix}${uuid}`;
};

module.exports.getFriendFeedName = () => {
    const uuid = module.exports.uuid();
    return `${module.exports.friendNamePrefix}${uuid}`;
};

module.exports.getNewFeedFileName = () => {
    const uuid = module.exports.uuid() + module.exports.uuid() + module.exports.uuid();
    return `feed-${uuid}.json`;
};

module.exports.assert = (cond, message) => {
    if (!cond) {
        throw new Error(message);
    }
};

module.exports.getNewVideoFileName = () => {
    const date = +new Date();

    return `${date}.mp4`;
};

module.exports.saveVideoToStatic = (pod, name, content) => {
    pod = pod.toLowerCase();
    name = name.toLowerCase();

    let videoPath = process.env.APP_STATIC_VIDEO_PATH;
    videoPath = `${videoPath}/${pod}`;
    fs.mkdirSync(videoPath, {recursive: true});
    videoPath = `${videoPath}/${name}`;
    fs.writeFileSync(videoPath, content);

    return true;
};

module.exports.isStaticVideoExists = (/*podOwnerAddress, */pod, name) => {
    // podOwnerAddress = podOwnerAddress.toLowerCase();
    pod = pod.toLowerCase();
    name = name.toLowerCase();

    let videoPath = process.env.APP_STATIC_VIDEO_PATH;
    // videoPath = `${videoPath}/${podOwnerAddress}/${pod}/${name}`;
    videoPath = `${videoPath}/${pod}/${name}`;

    return fs.existsSync(videoPath);
};

module.exports.getStaticVideo = (/*podOwnerAddress, */pod, name) => {
    // podOwnerAddress = podOwnerAddress.toLowerCase();
    pod = pod.toLowerCase();
    name = name.toLowerCase();

    let videoPath = process.env.APP_STATIC_VIDEO_PATH;
    // videoPath = `${videoPath}/${podOwnerAddress}/${pod}/${name}`;
    videoPath = `${videoPath}/${pod}/${name}`;

    return fs.readFileSync(videoPath);
};
