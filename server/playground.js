const {feedFilename} = require("./app/utils");
const {fairOS, getNewFeedName, getNewFeedFileName} = require("./app/utils");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function run() {
    const feedOwnerUser = {
        username: 'creator',
        password: 'creator',
        // https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt
        // https://iancoleman.io/bip39/#english
        mnemonic: 'guard trim broccoli accident beef organ same vital thrive oil alcohol uniform'
    };

    const testUser = {
        username: 'admin',
        password: 'admin',
        // https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt
        // https://iancoleman.io/bip39/#english
        mnemonic: 'series height alley dignity salad huge derive poem regret mercy inhale mesh'
    };

    const username = 'admin';
    const password = 'admin';

    await fairOS.userLogin(testUser.username, testUser.password);
    const list = await fairOS.podLs();
    const filtered = list?.shared_pod_name.filter(item => item.startsWith('Zoo-feed-'));
    console.log(filtered);

    console.log(await fairOS.podOpen(filtered[0], testUser.password));
    console.log(await fairOS.podDelete(filtered[0]));
    console.log(await fairOS.podLs());

    return;
    const content = 'lol prikol';
    const feedName = getNewFeedName();
    console.log('feedName', feedName);
    const l = await fairOS.userLogin(feedOwnerUser.username, feedOwnerUser.password);
    console.log(l);
    const a = await fairOS.podNew(feedName, feedOwnerUser.password);
    console.log(a);
    // we should relogin because fairOS 0.5.2 bug
    await fairOS.userLogin(feedOwnerUser.username, feedOwnerUser.password);
    const z = await fairOS.podOpen(feedName, feedOwnerUser.password);
    console.log(z);
    const r = await fairOS.fileUpload(content, feedFilename, feedName);
    console.log(r);
    // we should relogin because fairOS 0.5.2 bug

    await fairOS.userLogin(feedOwnerUser.username, feedOwnerUser.password);

    const result = await fairOS.podShare(feedName, feedOwnerUser.password);
    console.log('podShare result', result);
    const reference = result.pod_sharing_reference;
    await fairOS.userLogin(feedOwnerUser.username, feedOwnerUser.password);
    await fairOS.podOpen(feedName, feedOwnerUser.password);

    let aaa = await fairOS.dirLs(feedName, '/');
    console.log(aaa);

    /***********/


    await fairOS.userLogin(testUser.username, testUser.password);
    let resp = await fairOS.podReceiveInfo(reference);
    console.log(resp);
    const podName = resp.pod_name;

    resp = await fairOS.podReceive(reference);
    console.log(resp);

    resp = await fairOS.podOpen(podName);
    console.log(resp);

    resp = await fairOS.fileDownload(podName, 'feed.json');
    console.log(resp);


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
