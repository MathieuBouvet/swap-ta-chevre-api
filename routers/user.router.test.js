const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);
const setupMongoose = require("../utils/setupMongoose");
const dbUtils = require("../tests/dbUtils");

beforeAll(async () => {
  await setupMongoose("user-test-1");
});

afterAll(async () => {
  await dbUtils.jestTeardown();
});

describe("POST /users endpoint", () => {
  it("should create a new user", async () => {
    const res = await request.post("/users").send({
      username: "test-posting-user",
      password: "thepassword",
      mail: "test-posting-user@testmail.com",
      phoneNumber: "0945124578",
    });
    expect(res.statusCode).toBe(201);
  });
});
