const request = require("supertest");
const fs = require("fs");
const app = require("../app/app");
const {testUser} = require("./shared");
const {feedOwnerUser} = require("./shared");

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
        expect(response.body.data.created).toBeTruthy();
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
        let response = await request(app).post('/feed/friend/upload')
            .field('username', feedOwnerUser.username)
            .field('password', feedOwnerUser.password)
            .attach('video', './content/1.mp4');
        // .attach('video', './test/content/1.mp4');
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
            const fileName = `./content/${i}.mp4`;
            // const fileName = `./test/content/${i}.mp4`;
            const originalFileSize = fs.statSync(fileName).size;
            response = await request(app).post('/feed/friend/upload')
                .field('username', feedOwnerUser.username)
                .field('password', feedOwnerUser.password)
                .attach('video', fileName);
            expect(response.body.result).toBeTruthy();
            expect(response.body.data.reference).toHaveLength(128);
            expect(response.body.data.name).toBeDefined();
            const currentFileName = response.body.data.name;

            // todo get video file from static server
            // if (checkedFiles < checkMaxFiles) {
            //     // validate is correct file size after download
            //     response = await request(app).get(`/feed/friend/get-video?pod=${podName}&name=${currentFileName}&username=${feedOwnerUser.username}&password=${feedOwnerUser.password}`)
            //         .buffer()
            //         .parse(binaryParser);
            //     expect(response.body.length).toEqual(originalFileSize);
            //     checkedFiles++;
            // }
        }

    }, 60000);

    test("Check is uploaded to my account all videos", async () => {
        let response = await request(app).post('/feed/friend/get-my-videos').send({
            ...feedOwnerUser
        });
        expect(response.body.data).toHaveLength(11);
    });

    test("Check is new videos appears in other user account", async () => {
        let response = await request(app).post('/feed/friend/get-videos').send({
            ...testUser
        });
        // 10 not 11, because feed limitation for every user
        expect(response.body.data).toHaveLength(10);
    });

    // test("test", async () => {
    //     let response = await request(app).post('/feed/test').send({
    //         ...testUser
    //     });
    //     console.log(response.body);
    // });
});
