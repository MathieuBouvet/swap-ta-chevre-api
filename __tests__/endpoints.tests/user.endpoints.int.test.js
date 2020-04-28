/**
 * @jest-environment mongodb
 */

require("dotenv").config();
const supertest = require("supertest");
const app = require("../../app");
const request = supertest(app);
const dbUtils = require("../../test-utils/dbUtils");
const User = require("../../models/user.model");
const cookieParser = require("set-cookie-parser");
const jwt = require("jsonwebtoken");

beforeAll(dbUtils.setup);
afterAll(dbUtils.teardown);

describe("POST /users endpoint", () => {
  afterAll(async () => {
    await User.deleteMany({});
  });
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
    expect(res.body).toMatchObject({
      httpStatus: 400,
      httpMessage: "Bad Request",
      errorDetails: {
        username: {
          kind: "unique",
          name: "ValidatorError",
          message:
            "Error, expected `username` to be unique. Value: `test-posting-user`",
        },
      },
    });
  });
});

describe("POST /login endpoint", () => {
  let seededUser = null;
  beforeAll(async () => {
    seededUser = await new User({
      username: "test-posting-user",
      mail: "test-posting-user@testmail.com",
      password: "test-password",
    }).save();
  });
  it("should respond with a jwt auth token in a http only cookie", async () => {
    const res = await request.post("/users/login").send({
      username: "test-posting-user",
      password: "test-password",
    });
    const cookies = cookieParser(res, { map: true });
    const decoded = jwt.decode(cookies.accessToken.value);
    expect(res.status).toBe(201);
    expect(cookies.accessToken.httpOnly).toBeTruthy();
    expect(!!cookies.accessToken.secure).toBe(
      process.env.NODE_ENV === "production"
    );
    expect(decoded.sub).toBe(seededUser._id.toString());
    expect(jwt.verify(cookies.accessToken.value, process.env.JWT_SECRET_KEY));
  });
  it("should not log in unknown user", async () => {
    const invalidUsernameRequest = request.post("/users/login").send({
      username: "unknown-username",
      password: "test-password",
    });
    const invalidPasswordRequest = request.post("/users/login").send({
      username: "test-posting-user",
      password: "password-don't-match",
    });
    const [invalidUsernameRes, invalidPasswordRes] = await Promise.all([
      invalidUsernameRequest,
      invalidPasswordRequest,
    ]);
    const invalidUsernameCookie = cookieParser(invalidUsernameRes, {
      map: true,
    });
    const invalidPasswordCookie = cookieParser(invalidPasswordRes, {
      map: true,
    });
    expect(invalidUsernameRes.status).toBe(401);
    expect(invalidUsernameRes.body).toMatchObject({
      httpStatus: 401,
      httpMessage: "Unauthorized",
    });
    expect(invalidUsernameCookie).toEqual({});

    expect(invalidPasswordRes.status).toBe(401);
    expect(invalidPasswordRes.body).toMatchObject({
      httpStatus: 401,
      httpMessage: "Unauthorized",
    });
    expect(invalidPasswordCookie).toEqual({});
  });
});
