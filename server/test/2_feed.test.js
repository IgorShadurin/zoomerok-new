const request = require("supertest");
const app = require("../app/app");
const {feedOwnerUser} = require("./shared");

describe("Feed test", () => {
    // test("Feed get not logged in", async () => {
    //     const response = await request(app).get('/feed').send(passwordObject);
    //     expect(response.body.result).toBeFalsy();
    // });

    // test("Get feed source", async () => {
    //     const response = await request(app).get('/feed').send(passwordObject);
    //     expect(response.body.result).toBeTruthy();
    // });

    test("Init default feed", async () => {
        const feedData1 = [
            {title: "One", file: "file1.mp4"}
        ];
        let response = await request(app).post('/feed/new').send({
            ...feedOwnerUser,
            content: JSON.stringify(feedData1)
        });
        expect(response.body.result).toBeTruthy();
        expect(response.body.data).toHaveLength(128);
    });
});
