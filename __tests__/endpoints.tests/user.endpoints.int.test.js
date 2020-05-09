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
const {
  userSeed,
  badUserSeed,
  userSeedWithPassword,
  getRelevantUserFields,
} = require("../../test-utils/userSeedData");
const { getFreshToken } = require("../../services/accessToken.service");
const { USER } = require("../../utils/roles");

beforeAll(dbUtils.setup);
afterAll(dbUtils.teardown);

describe("POST /users endpoint", () => {
  afterEach(async () => {
    await User.deleteMany({});
  });
  it("should respond correctly when input is OK", async () => {
    const res = await request.post("/users").send(userSeedWithPassword);
    const createdUser = await User.findOne({
      username: "test-user",
    });
    const createdUserData = getRelevantUserFields(createdUser.toObject(), {
      includeId: false,
    });

    expect(res.type).toBe("application/json");
    expect(res.statusCode).toBe(201);
    expect(createdUserData).toEqual(userSeed);
  });

  it("should respond correctly to inputs failing validations", async () => {
    const res = await request.post("/users").send(badUserSeed);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
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
        role: {
          kind: "enum",
          message: "`bad` is not a valid enum value for path `role`.",
          name: "ValidatorError",
        },
      },
    });
  });

  it("should respond correctly to a duplicate username", async () => {
    await request.post("/users").send(userSeedWithPassword);
    const res = await request.post("/users").send(userSeedWithPassword);
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      httpStatus: 400,
      httpMessage: "Bad Request",
      errorDetails: {
        username: {
          kind: "unique",
          name: "ValidatorError",
          message:
            "Error, expected `username` to be unique. Value: `test-user`",
        },
      },
    });
  });
});

describe("POST /login endpoint", () => {
  let seededUser = null;
  beforeAll(async () => {
    seededUser = await new User(userSeedWithPassword).save();
  });
  afterAll(async () => {
    await User.deleteMany({});
  });
  it("should respond with a jwt auth token in a http only cookie", async () => {
    const res = await request.post("/users/login").send({
      username: "test-user",
      password: "test-user-password",
    });
    const cookies = cookieParser(res, { map: true });
    const decoded = jwt.decode(cookies.accessToken.value);
    expect(res.status).toBe(201);
    expect(cookies.accessToken.httpOnly).toBeTruthy();
    expect(!!cookies.accessToken.secure).toBe(
      process.env.NODE_ENV === "production"
    );
    expect(decoded.sub).toBe(seededUser._id.toString());
    expect(decoded.role).toBe(USER);
    expect(jwt.verify(cookies.accessToken.value, process.env.JWT_SECRET_KEY));
  });
  it.each([
    [
      "unknown user",
      {
        username: "unknown-username",
        password: "test-password",
      },
    ],
    [
      "known user with bad password",
      {
        username: "test-user",
        password: "password-doesn't-match",
      },
    ],
  ])("should not login %s", async (badLoginData) => {
    const invalidLogin = await request.post("/users/login").send(badLoginData);
    const invalidRequestCookie = cookieParser(invalidLogin, {
      map: true,
    });
    expect(invalidLogin.status).toBe(401);
    expect(invalidLogin.body).toMatchObject({
      httpStatus: 401,
      httpMessage: "Unauthorized",
    });
    expect(invalidRequestCookie).toEqual({});
  });
});

describe("GET /users/:id endpoint", () => {
  let seededUser = null;
  beforeAll(async () => {
    const mongooseUser = await new User(userSeedWithPassword).save();
    seededUser = getRelevantUserFields(mongooseUser);
  });
  afterAll(async () => {
    await User.deleteMany({});
  });
  it("should return the user", async () => {
    const user = await request.get("/users/" + seededUser._id);
    expect(user.body).toEqual(seededUser);
  });

  it("should return 404 when no user found", async () => {
    const notFound = await request.get("/users/42");
    expect(notFound.statusCode).toBe(404);
    expect(notFound.body).toEqual({
      httpStatus: 404,
      httpMessage: "Not Found",
      errorDetails: "User 42 not found",
    });
  });
});

describe("DELETE /users/:id endpoint", () => {
  afterEach(async () => {
    await User.deleteMany({});
  });
  it.todo("should allow deletion by admin");
  it.todo("should allow deletion by author");
  it("should not allow deletion by simple user", async () => {
    const user = await new User(userSeedWithPassword).save();
    const simpleUserToken = getFreshToken({
      _id: 42,
      role: USER,
    });
    const deleteSimpleUser = await request
      .delete("/users/" + user._id)
      .set("Cookie", ["accessToken=" + simpleUserToken]);
    const findUser = await User.findById(user._id);
    expect(deleteSimpleUser.statusCode).toBe(403);
    expect(findUser).not.toBeNull();
  });
  it("should not allow deletion by anonymous user", async () => {
    const user = await new User(userSeedWithPassword).save();
    const deleteAnon = await request.delete("/users/" + user._id);
    const findUser = await User.findById(user._id);
    expect(deleteAnon.statusCode).toBe(401);
    expect(findUser).not.toBeNull();
  });
});
