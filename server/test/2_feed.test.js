const request = require("supertest");
const fetch = require("node-fetch");
const fs = require("fs");
const app = require("../app/app");
const {testUser, videoDescription1, feedOwnerUser} = require("./shared");

function binaryParser(res, callback) {
    res.setEncoding('binary');
    res.data = '';
    res.on('data', function (chunk) {
        res.data += chunk;
    });
    res.on('end', function () {
        callback(null, new Buffer(res.data, 'binary'));
    });
}

describe("Feed test", () => {
    let defaultFeedReference = '';
    let defaultFeedReference2 = '';
    let defaultFeedName = '';
    let defaultFeedName2 = '';

    let user1FeedReference = '';

    const feedData1 = [
        {title: "One", file: "file1.mp4"}
    ];
    const feedData2 = [
        {title: "One", file: "file1.mp4"},
        {title: "Two", file: "file2.mp4"},
        {title: "Three", file: "file3.mp4"}
    ];

    // test("Feed get not logged in", async () => {
    //     const response = await request(app).get('/feed').send(passwordObject);
    //     expect(response.body.result).toBeFalsy();
    // });

    // test("Get feed source", async () => {
    //     const response = await request(app).get('/feed').send(passwordObject);
    //     expect(response.body.result).toBeTruthy();
    // });

    test("Init default feed", async () => {
        let response = await request(app).post('/feed/new').send({
            ...feedOwnerUser,
            content: JSON.stringify(feedData1)
        });
        expect(response.body.result).toBeTruthy();
        expect(response.body.data.name).toBeDefined();
        expect(response.body.data.reference).toHaveLength(128);
        defaultFeedReference = response.body.data.reference;
        defaultFeedName = response.body.data.name;
    });

    test("Receive and compare feed content from other user", async () => {
        let response = await request(app).post('/feed/get-content').send({
            ...testUser,
            reference: defaultFeedReference
        });
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toEqual(JSON.stringify(feedData1))
    });

    test("Modify existing feed", async () => {
        let response = await request(app).post('/feed/update').send({
            ...feedOwnerUser,
            feedName: defaultFeedName,
            content: JSON.stringify(feedData2)
        });
        expect(response.body.result).toBeTruthy();
    });

    test("Receive and compare feed content 2 from other user", async () => {
        let response = await request(app).post('/feed/get-content').send({
            ...testUser,
            isReceive: false,
            reference: defaultFeedReference
        });
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toEqual(JSON.stringify(feedData2))
    });

    test("Check feeds count", async () => {
        let response = await request(app).post('/feed/source/get').send({
            ...testUser
        });
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data).toContain(defaultFeedName);
    });

    test("Create new feed", async () => {
        let response = await request(app).post('/feed/new').send({
            ...feedOwnerUser,
            content: JSON.stringify(feedData1)
        });
        expect(response.body.result).toBeTruthy();
        expect(response.body.data.name).toBeDefined();
        expect(response.body.data.reference).toHaveLength(128);
        defaultFeedReference2 = response.body.data.reference;
        defaultFeedName2 = response.body.data.name;
    });

    test("Add reference via source/add", async () => {
        let response = await request(app).post('/feed/source/add').send({
            ...testUser,
            reference: defaultFeedReference2
        });
        expect(response.body.result).toBeTruthy();
    });

    test("Check feeds count after second feed added", async () => {
        let response = await request(app).post('/feed/source/get').send({
            ...testUser
        });
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toHaveLength(2);
        expect(response.body.data).toContain(defaultFeedName);
        expect(response.body.data).toContain(defaultFeedName2);
    });

    test("Init own public feed", async () => {
        let response = await request(app).post('/feed/friend/init').send({
            ...feedOwnerUser
        });
        expect(response.body.result).toBeTruthy();
        expect(response.body.data.name).toBeDefined();
        expect(response.body.data.reference).toHaveLength(128);
        user1FeedReference = response.body.data.reference;
    });

    test("Get init feed reference again", async () => {
        let response = await request(app).post('/feed/friend/get-my-reference').send({
            ...feedOwnerUser
        });
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toHaveLength(128);
    });

    test("Init own public feed again", async () => {
        let response = await request(app).post('/feed/friend/init').send({
            ...feedOwnerUser
        });
        expect(response.body.result).toBeFalsy();
    });

    test("Add user to friends", async () => {
        let response = await request(app).post('/feed/friend/add').send({
            ...testUser,
            reference: user1FeedReference
        });
        expect(response.body.result).toBeTruthy();
        expect(response.body.data.name).toBeDefined();
    });

    test("Get friends list", async () => {
        let response = await request(app).post('/feed/friend/list').send({
            ...testUser
        });
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toHaveLength(1);
    });

    test("Upload videos to creator's feed", async () => {
        const video1 = './content/1.mp4';
        const video2 = './test/content/1.mp4';
        // different paths for different ways of testing
        const video = fs.existsSync(video1) ? video1 : video2;
        let response = await request(app).post('/feed/friend/upload')
            .field('username', feedOwnerUser.username)
            .field('password', feedOwnerUser.password)
            .field('description', videoDescription1)
            .attach('video', video);
        expect(response.body.result).toBeTruthy();
        expect(response.body.data.reference).toHaveLength(128);
        expect(response.body.data.name).toBeDefined();
    }, 60000);

    test("Check is uploaded to my account", async () => {
        let response = await request(app).post('/feed/friend/get-my-videos').send({
            ...feedOwnerUser
        });
        expect(response.body.data).toHaveLength(1);
    });

    test("Check is new video appears in other user account", async () => {
        let response = await request(app).post('/feed/friend/get-videos').send({
            ...testUser
        });
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].description).toEqual(videoDescription1);
        expect(response.body.data[0].username).toEqual(feedOwnerUser.username);
    });

    test("Upload more videos to creator's feed", async () => {
        // limit to speedup testing
        const checkMaxFiles = 3;
        let checkedFiles = 0;

        // get actual pod name
        let response = await request(app).post(`/feed/friend/get-my-pod-name`)
            .send({
                ...feedOwnerUser
            });
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toBeDefined();
        const podName = response.body.data;

        for (let i = 2; i <= 11; i++) {
            const description = `Description ${i}`;
            const fileName1 = `./content/${i}.mp4`;
            const fileName2 = `./test/content/${i}.mp4`;
            const fileName = fs.existsSync(fileName1) ? fileName1 : fileName2;
            const originalFileSize = fs.statSync(fileName).size;
            response = await request(app).post('/feed/friend/upload')
                .field('username', feedOwnerUser.username)
                .field('password', feedOwnerUser.password)
                .field('description', description)
                .attach('video', fileName);
            expect(response.body.result).toBeTruthy();
            expect(response.body.data.reference).toHaveLength(128);
            expect(response.body.data.name).toBeDefined();

            const currentFileName = response.body.data.name;
            if (checkedFiles < checkMaxFiles) {
                const url = `http://localhost/video/${podName}/${currentFileName}`;
                response = await fetch(url);
                response = await response.buffer();
                expect(response.length).toEqual(originalFileSize);
                checkedFiles++;
            }
        }

    }, 60000);

    test("Check is uploaded to my account all videos", async () => {
        let response = await request(app).post('/feed/friend/get-my-videos').send({
            ...feedOwnerUser
        });
        expect(response.body.data).toHaveLength(11);
        let itemId = 0;
        for (let i = 11; i >= 2; i--) {
            expect(response.body.data[itemId].description).toEqual(`Description ${i}`);
            expect(response.body.data[itemId].username).toBeDefined();
            itemId++;
        }
    });

    test("Check is new videos appears in other user account", async () => {
        let response = await request(app).post('/feed/friend/get-videos').send({
            ...testUser
        });
        // 10 not 11, because feed limitation for every user
        expect(response.body.data).toHaveLength(10);
    });

    test("Upload video without inited pod", async () => {
        const i = 1;
        const description = `Description ${i}`;
        const fileName1 = `./content/${i}.mp4`;
        const fileName2 = `./test/content/${i}.mp4`;
        const fileName = fs.existsSync(fileName1) ? fileName1 : fileName2;
        const response = await request(app).post('/feed/friend/upload')
            .field('username', testUser.username)
            .field('password', testUser.password)
            .field('description', description)
            .attach('video', fileName);

        expect(response.body.result).toBeTruthy();
        expect(response.body.data.reference).toHaveLength(128);
        expect(response.body.data.name).toBeDefined();
    }, 60000);

    test("Upload mov file", async () => {
        const video1 = './content/original1.mov';
        const video2 = './test/content/original1.mov';
        // different paths for different ways of testing
        const video = fs.existsSync(video1) ? video1 : video2;
        let response = await request(app).post('/feed/friend/upload')
            .field('username', feedOwnerUser.username)
            .field('password', feedOwnerUser.password)
            .field('description', videoDescription1)
            .attach('video', video);
        expect(response.body.result).toBeTruthy();
        expect(response.body.data.reference).toHaveLength(128);
        expect(response.body.data.name).toBeDefined();
    }, 60000);

    // todo check preview uploading

    // test("test", async () => {
    //     let response = await request(app).post('/feed/test').send({
    //         ...testUser
    //     });
    //     console.log(response.body);
    // });
});
