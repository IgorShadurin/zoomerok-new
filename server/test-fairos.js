const {fairOS, getNewFeedName, getNewFeedFileName} = require("./app/utils");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function run() {
    const username = 'admin';
    const password = 'admin';

    // let response = await fairOS.userSignup(username, password);
    // console.log(response);

    let response = await fairOS.userLogin(username, password);
    console.log(response);

    const feedName = getNewFeedName();
    console.log('feedName', feedName);

    response = await fairOS.podNew(feedName, password);
    console.log(response);

    response = await fairOS.podOpen(feedName, password);
    console.log(response);

    response = await fairOS.podShare(feedName, password);
    console.log(response);

    response = await fairOS.fileUpload('hello world', 'info.json', feedName);
    console.log(response);

    response = await fairOS.fileDownload(feedName, 'info.json');
    console.log(response);

    //
    // response = await fairOS.fileDelete(feedName, 'info.json');
    // console.log(response);
    //
    // response = await fairOS.fileUpload('hello world1111', 'info.json', feedName);
    // console.log(response);
    // response = await fairOS.fileDownload(feedName, 'info.json');
    // console.log(response);
    // for (let i = 0; i < 1; i++) {
    //     console.log('=====');
    //     const fileName = getNewFeedFileName();
    //     const content = `hello world ${i}`;
    //     console.log(fileName);
    //     response = await fairOS.fileUpload(content, fileName, feedName);
    //     console.log(response);
    //
    //     response = await fairOS.fileDownload(feedName, fileName);
    //     console.log(response);
    //     if (content === response) {
    //         console.log('OK');
    //     } else {
    //         console.log('NOT OK');
    //     }
    //
    //     response = await fairOS.fileDelete(feedName, fileName);
    //     console.log(response);
    //     console.log('=====');
    // }

    response = await fairOS.dirLs(feedName, '/');
    console.log(response);
}

run().then(_ => {
    console.log('');
});
