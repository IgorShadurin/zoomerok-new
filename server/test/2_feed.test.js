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
            .attach('video', './content/video1.mp4');
        // .attach('video', './test/content/video1.mp4');
        expect(response.body.result).toBeTruthy();
        expect(response.body.data.reference).toHaveLength(128);
        expect(response.body.data.name).toBeDefined();
    }, 60000);

    test("Check is new video appears in other user account", async () => {
        let response = await request(app).post('/feed/friend/get').send({
            ...testUser
        });
        expect(response.body.data).toHaveLength(1);
    });

});
