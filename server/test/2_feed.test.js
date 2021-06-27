const request = require("supertest");
const app = require("../app/app");

describe("Feed test", () => {
    const testUser = {
        username: 'admin',
        password: 'admin',
        seed: 'one two three'
    };

    test("Feed get not logged in", async () => {
        const response = await request(app).get('/feed').send(testUser);
        expect(response.body.result).toBeFalsy();
    });

    test("Feed get logged in", async () => {
        const response = await request(app).get('/feed').send(testUser);
        expect(response.body.result).toBeTruthy();
    });
});
