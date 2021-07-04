const {feedFilename} = require("./app/utils");
const {fairOS, getNewFeedName, getNewFeedFileName} = require("./app/utils");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function run() {
    const username = 'admin';
    const password = 'admin';

    const content = 'lol prikol';
    const feedName = getNewFeedName();
    console.log('feedName', feedName);
    const l = await fairOS.userLogin(username, password);
    console.log(l);
    const a = await fairOS.podNew(feedName, password);
    console.log(a);
    // we should relogin because fairOS 0.5.2 bug
    await fairOS.userLogin(username, password);
    const z = await fairOS.podOpen(feedName, password);
    console.log(z);
    const r = await fairOS.fileUpload(content, feedFilename, feedName);
    console.log(r);
    // we should relogin because fairOS 0.5.2 bug

    await fairOS.userLogin(username, password);

    const result = await fairOS.podShare(feedName, password);
    console.log('podShare result', result);
    await fairOS.userLogin(username, password);
    await fairOS.podOpen(feedName, password);

    let aaa = await fairOS.dirLs(feedName, '/');
    console.log(aaa);
    return;

    // let response = await fairOS.userSignup(username, password);
    // console.log(response);

    let response = await fairOS.userLogin(username, password);
    console.log(response);

    const podFeedName = getNewFeedName();
    console.log('podFeedName', podFeedName);

    response = await fairOS.podNew(podFeedName, password);
    console.log(response);

    // relogin for using created pod
    response = await fairOS.userLogin(username, password);

    response = await fairOS.podOpen(podFeedName, password);
    console.log(response);

    for (let i = 0; i < 1; i++) {
        console.log('=====');
        const fileName = getNewFeedFileName();
        const content = `hello world ${i}`;
        console.log(fileName);
        response = await fairOS.fileUpload(content, fileName, podFeedName);
        console.log(response);

        response = await fairOS.fileDownload(podFeedName, fileName);
        console.log(response);
        if (content === response) {
            console.log('OK');
        } else {
            console.log('NOT OK');
        }

        response = await fairOS.fileDelete(podFeedName, fileName);
        console.log(response);

        console.log('=====');
    }

    // response = await fairOS.kvNew(podFeedName, 'Zoomerok-feed');
    // console.log(response);

    // response = await fairOS.kvOpen(podFeedName, 'Zoomerok-feed');
    // console.log(response);

    // response = await fairOS.kvPut(podFeedName, 'Zoomerok-feed', 'feed', JSON.stringify([
    //     {title: "one"},
    //     {title: "two"},
    // ]));
    // console.log(response);

    // response = await fairOS.kvGet(podFeedName, 'Zoomerok-feed', 'feed');
    // console.log(response);

    response = await fairOS.dirLs(podFeedName, '/');
    console.log(response);

    response = await fairOS.userLogin(username, password);

    response = await fairOS.podShare(podFeedName, password);
    console.log(response);
}

run().then(_ => {
    console.log('');
});
