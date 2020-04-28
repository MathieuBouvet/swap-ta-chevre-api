/**
 * @jest-environment mongodb
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const createUser = require("../../services/user.service").createUser;
const findUserById = require("../../services/user.service").findUserById;
const findUserByName = require("../../services/user.service").findUserByName;
const User = require("../../models/user.model");
const InvalidArgumentError = require("../../utils/errors/InvalidArgumentError");

const dbUtils = require("../../test-utils/dbUtils");

beforeAll(dbUtils.setup);

afterAll(dbUtils.teardown);

const userData = {
  username: "thetestuser",
  password: "theuserpassword",
  mail: "theusermail@test-mail.com",
};

describe("User creation service", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  it("should return a user", async () => {
    const userDocument = await createUser(userData);
    expect(userDocument).toBeInstanceOf(User);
  });

  it("should throw an error when userData is not an object", async () => {
    await expect(createUser()).rejects.toThrow(InvalidArgumentError);
    await expect(createUser(undefined)).rejects.toThrow(InvalidArgumentError);
    await expect(createUser(null)).rejects.toThrow(InvalidArgumentError);
    await expect(createUser("string")).rejects.toThrow(InvalidArgumentError);
    await expect(createUser(42)).rejects.toThrow(InvalidArgumentError);
    await expect(createUser([])).rejects.toThrow(InvalidArgumentError);
  });

  it("should save user in database", async () => {
    const userDocument = await createUser(userData);
    const userInDataBase = await User.findById(userDocument._id);
    expect(userInDataBase.username).toBe(userData.username);
    expect(userInDataBase.mail).toBe(userData.mail);
  });

  it("should hash the password", async () => {
    const userDocument = await createUser(userData);
    const userInDataBase = await User.findById(userDocument._id);
    expect(userInDataBase.password).not.toBe(userData.password);
    const match = await bcrypt.compare(
      userData.password,
      userInDataBase.password
    );
    expect(match).toBe(true);
  });

  it("should not hash password if not modified", async () => {
    const userDocument = await createUser(userData);
    const userInDb = await User.findById(userDocument._id);
    const resavedUser = await userInDb.save();

    expect(resavedUser.password).toBe(userDocument.password);
  });

  it("should not allow duplicate username", async () => {
    await createUser(userData);
    await expect(createUser(userData)).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });
});

describe("User finder by id service", () => {
  let seededUser = null;
  beforeAll(async () => {
    seededUser = await new User({
      username: "test-user-username",
      password: "test-user-password",
      mail: "test-user-mail@test-mail.com",
    }).save();
  });
  afterAll(async () => {
    await User.deleteMany({});
  });
  it("should return user with given id", async () => {
    const searchedUser = await findUserById(seededUser._id);
    expect(searchedUser.toObject()).toMatchObject(seededUser.toObject());
  });
  it("should allow fields selection", async () => {
    const searchedUser = await findUserById(seededUser._id, "username -_id");
    expect(searchedUser.toObject()).toEqual({ username: "test-user-username" });
  });
  it("should return null when id is not found", async () => {
    const notFound = await findUserById(mongoose.Types.ObjectId());
    expect(notFound).toBeNull();
  });
  it("should return null when given id is not castable as mongoose id", async () => {
    const notCastable = await findUserById("hahaha");
    expect(notCastable).toBeNull();
  });
  it("should throw exceptions normally", async () => {
    const shouldThrow = findUserById(seededUser._id, "", { projection: true });
    await expect(shouldThrow).rejects.toThrow();
  });
});

describe("User finder by name service", () => {
  let seededUser = null;
  beforeAll(async () => {
    seededUser = await new User({
      username: "test-user-username",
      password: "test-user-password",
      mail: "test-user-mail@test-mail.com",
    }).save();
  });
  it("Should return user with given name", async () => {
    const searchedUser = await findUserByName(seededUser.username);
    expect(searchedUser.toObject()).toMatchObject(seededUser.toObject());
  });
  it("should allow fields selection", async () => {
    const searchedUser = await findUserByName(
      seededUser.username,
      "username -_id"
    );
    expect(searchedUser.toObject()).toEqual({ username: "test-user-username" });
  });
  it("should return null when username does not exist", async () => {
    const notFound = await findUserByName("username-does-not-exist");
    expect(notFound).toBeNull();
  });
});