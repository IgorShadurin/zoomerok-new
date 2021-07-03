const request = require("supertest");
const app = require("../app/app");

describe("Feed test", () => {
    const testUser = {
        username: 'admin',
        password: 'admin',
        seed: 'one two three'
    };

    const passwordObject = {
        password: 'admin'
    };

    // test("Feed get not logged in", async () => {
    //     const response = await request(app).get('/feed').send(passwordObject);
    //     expect(response.body.result).toBeFalsy();
    // });

    test("Get feed source", async () => {
        const response = await request(app).get('/feed').send(passwordObject);
        expect(response.body.result).toBeTruthy();
    });
});
