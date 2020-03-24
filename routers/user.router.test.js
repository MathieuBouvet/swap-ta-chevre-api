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
  it("should respond correctly when input is OK", async () => {
    const res = await request.post("/users").send({
      username: "test-posting-user",
      password: "thepassword",
      mail: "test-posting-user@testmail.com",
      phoneNumber: "0945124578",
    });
    expect(res.type).toBe("application/json");
    expect(res.statusCode).toBe(201);
  });

  it("should respond correctly to inputs failing validations", async () => {
    const res = await request.post("/users").send({
      username: "bad",
      password: "bad",
      mail: "bad",
      phoneNumber: "bad",
    });
    expect(res.status).toBe(400);
    // todo check for correct error object in response body
  });

  it("should respond correctly to a duplicate username", async () => {
    await request.post("/users").send({
      username: "test-posting-user",
      password: "thepassword",
      mail: "test-posting-user@testmail.com",
      phoneNumber: "0945124578",
    });
    const res = await request.post("/users").send({
      username: "test-posting-user",
      password: "thepassword",
      mail: "test-posting-user@testmail.com",
      phoneNumber: "0945124578",
    });
    expect(res.status).toBe(400);
    // todo cehck for correct error object in response body
  });
});
