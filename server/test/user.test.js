const request = require("supertest");
const app = require("../app");

describe("User test", () => {
    const testUser = {
        username: 'admin',
        password: 'admin',
        seed: 'one two three'
    };
    const notExistsUser = {
        username: 'abc',
        password: 'abc'
    };

    test("User new ok", async () => {
        const response = await request(app).post('/user/new').send(testUser);
        // expect(response.statusCode).toBe(200);
        expect(response.body.result).toBeTruthy();
    });

    test("User new empty input", async () => {
        const response = await request(app).post('/user/new');
        expect(response.body.result).toBeFalsy();
    });

    test("User login exists", async () => {
        const response = await request(app).post('/user/login').send({
            username: testUser.username,
            password: testUser.password,
        });
        expect(response.body.result).toBeTruthy();
    });

    test("User login not exists", async () => {
        const response = await request(app).post('/user/login').send(notExistsUser);
        expect(response.body.result).toBeFalsy();
    });
});
