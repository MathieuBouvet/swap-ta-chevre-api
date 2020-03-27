const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);
const setupMongoose = require("../utils/setupMongoose");
const dbUtils = require("../tests/dbUtils");
const User = require("../models/user.model");

beforeAll(async () => {
  await setupMongoose("user-test-1");
});

afterAll(async () => {
  await dbUtils.jestTeardown();
});

describe("POST /users endpoint", () => {
  it("should respond correctly when input is OK", async () => {
    const userData = {
      username: "test-posting-user",
      mail: "test-posting-user@testmail.com",
      phoneNumber: "0945124578",
    };
    const userDataWithPassword = {
      ...userData,
      password: "test-posting-user-password",
    };
    const res = await request.post("/users").send(userDataWithPassword);
    const createdUser = await User.findOne({
      username: "test-posting-user",
    }).select("username mail phoneNumber -_id");

    expect(res.type).toBe("application/json");
    expect(res.statusCode).toBe(201);
    expect(createdUser.toObject()).toEqual(userData);
  });

  it("should respond correctly to inputs failing validations", async () => {
    const res = await request.post("/users").send({
      username: "bad",
      password: "bad",
      mail: "bad",
      phoneNumber: "bad",
    });
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      httpStatus: 400,
      httpMessage: "Bad Request",
      errorDetails: {
        mail: {
          kind: "regexp",
          name: "ValidatorError",
          message: "Path `mail` is invalid (bad).",
        },
        password: {
          kind: "minlength",
          name: "ValidatorError",
          message:
            "Path `password` (`bad`) is shorter than the minimum allowed length (8).",
        },
        phoneNumber: {
          kind: "regexp",
          name: "ValidatorError",
          message: "Path `phoneNumber` is invalid (bad).",
        },
        username: {
          kind: "minlength",
          name: "ValidatorError",
          message:
            "Path `username` (`bad`) is shorter than the minimum allowed length (8).",
        },
      },
    });
  });

  it("should respond correctly to a duplicate username", async () => {
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
