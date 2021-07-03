const request = require("supertest");
const app = require("../app/app");

const feedOwnerUser = {
    username: 'creator',
    password: 'creator',
    // https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt
    // https://iancoleman.io/bip39/#english
    mnemonic: 'guard trim broccoli accident beef organ same vital thrive oil alcohol uniform'
};

const testUser = {
    username: 'admin',
    password: 'admin',
    // https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt
    // https://iancoleman.io/bip39/#english
    mnemonic: 'series height alley dignity salad huge derive poem regret mercy inhale mesh'
};
const notExistsUser = {
    username: 'abc',
    password: 'abc'
};

describe("User test / create new", () => {
    // beforeAll(() => {
    //     console.log('before all');
    // });
    //
    // afterAll((done) => {
    //     console.log('after all');
    // });

    // test("Init default feed", async () => {
    //     let response = await request(app).post('/user/new').send(feedOwnerUser);
    //     expect(response.body.result).toBeTruthy();
    //     response = await request(app).post('/f/new').send(feedOwnerUser);
    // });

    test("User create new", async () => {
        const response = await request(app).post('/user/new').send(testUser);
        // expect(response.statusCode).toBe(200);
        expect(response.body.result).toBeTruthy();
    });

    test("User create new again", async () => {
        const response = await request(app).post('/user/new').send(testUser);
        expect(response.body.result).toBeFalsy();
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
