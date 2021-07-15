const request = require("supertest");
const app = require("../app/app");
const {notExistsUser, withoutSeedUser, testUser, feedOwnerUser} = require("./shared");

describe("User test / create new", () => {
    // beforeAll(() => {
    //     console.log('before all');
    // });
    //
    // afterAll((done) => {
    //     console.log('after all');
    // });

    test("Init creator user", async () => {
        let response = await request(app).post('/user/new').send(feedOwnerUser);
        expect(response.body.result).toBeTruthy();
    });

    test("User create new", async () => {
        const response = await request(app).post('/user/new').send(testUser);
        // expect(response.statusCode).toBe(200);
        expect(response.body.result).toBeTruthy();
    });

    test("User create new again", async () => {
        const response = await request(app).post('/user/new').send(testUser);
        expect(response.body.result).toBeFalsy();
    });

    test("Creator user without seed", async () => {
        let response = await request(app).post('/user/new').send(withoutSeedUser);
        expect(response.body.result).toBeTruthy();
        expect(response.body.data.mnemonic).toBeDefined();
        expect(response.body.data.mnemonic.split(' ')).toHaveLength(12);
        expect(response.body.data.address).toHaveLength(42)
    });
});

describe("User test / for created", () => {
    test("User create new empty input", async () => {
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
