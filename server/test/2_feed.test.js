const request = require("supertest");
const app = require("../app/app");
const {testUser} = require("./shared");
const {feedOwnerUser} = require("./shared");

describe("Feed test", () => {
    let defaultFeedAddress = '';
    let defaultFeedName = '';
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
        defaultFeedAddress = response.body.data.reference;
        defaultFeedName = response.body.data.name;
    });

    test("Receive and compare feed content from other user", async () => {
        let response = await request(app).post('/feed/get-content').send({
            ...testUser,
            reference: defaultFeedAddress
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
            reference: defaultFeedAddress
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
    });
});
