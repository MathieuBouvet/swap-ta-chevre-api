/**
 * @jest-environment mongodb
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const createUser = require("../../services/user.service").createUser;
const findUserById = require("../../services/user.service").findUserById;
const findUserByName = require("../../services/user.service").findUserByName;
const deleteUser = require("../../services/user.service").deleteUser;
const updateUser = require("../../services/user.service").updateUser;
const User = require("../../models/user.model");
const { InvalidArgumentError } = require("../../utils/errors");

const dbUtils = require("../../test-utils/dbUtils");
const {
  userSeedWithPassword,
  getRelevantUserFields,
} = require("../../test-utils/userSeedData");

beforeAll(dbUtils.setup);

afterAll(dbUtils.teardown);

describe("User creation service", () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should return a user", async () => {
    const userDocument = await createUser(userSeedWithPassword);
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
    const userDocument = await createUser(userSeedWithPassword);
    const userInDataBase = await User.findById(userDocument._id);
    expect(userDocument.toObject()).toEqual(userInDataBase.toObject());
  });

  it("should hash the password", async () => {
    const userDocument = await createUser(userSeedWithPassword);
    const userInDataBase = await User.findById(userDocument._id);
    expect(userInDataBase.password).not.toBe(userSeedWithPassword.password);
    const match = await bcrypt.compare(
      userSeedWithPassword.password,
      userInDataBase.password
    );
    expect(match).toBe(true);
  });

  it("should not hash password if not modified", async () => {
    const userDocument = await createUser(userSeedWithPassword);
    const userInDb = await User.findById(userDocument._id);
    const resavedUser = await userInDb.save();

    expect(resavedUser.password).toBe(userDocument.password);
  });

  it("should not allow duplicate username", async () => {
    await createUser(userSeedWithPassword);
    await expect(createUser(userSeedWithPassword)).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });
});

describe("User finder by id service", () => {
  let seededUser = null;
  beforeAll(async () => {
    seededUser = await new User(userSeedWithPassword).save();
  });
  afterAll(async () => {
    await User.deleteMany({});
  });
  it("should return user with given id", async () => {
    const searchedUser = await findUserById(seededUser._id);
    expect(searchedUser.toObject()).toEqual(seededUser.toObject());
  });
  it("should allow fields selection", async () => {
    const searchedUser = await findUserById(seededUser._id, "username -_id");
    expect(searchedUser.toObject()).toEqual({ username: "test-user" });
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
    seededUser = await new User(userSeedWithPassword).save();
  });
  afterAll(async () => {
    await User.deleteMany({});
  });
  it("Should return user with given name", async () => {
    const searchedUser = await findUserByName(seededUser.username);
    expect(searchedUser.toObject()).toEqual(seededUser.toObject());
  });
  it("should allow fields selection", async () => {
    const searchedUser = await findUserByName(
      seededUser.username,
      "username -_id"
    );
    expect(searchedUser.toObject()).toEqual({ username: "test-user" });
  });
  it("should return null when username does not exist", async () => {
    const notFound = await findUserByName("username-does-not-exist");
    expect(notFound).toBeNull();
  });
});

describe("delete user", () => {
  let seededUser = null;
  beforeAll(async () => {
    seededUser = await new User({
      username: "test-user",
      mail: "test-user-mail@test.com",
      password: "the-test-password",
    }).save();
  });
  afterAll(async () => {
    await User.deleteMany({});
  });
  it("should delete the user with the given id", async () => {
    await deleteUser(seededUser._id);
    const deletedUser = await User.findById(seededUser._id);
    expect(deletedUser).toBeNull();
  });
  it("should not throw error on uncastable id", async () => {
    const uncastableIdDeletion = await deleteUser(42);
    expect(uncastableIdDeletion).toEqual({ n: 0, ok: 1, deletedCount: 0 });
  });
});

describe("update user", () => {
  let seededUser = null;
  beforeAll(async () => {
    seededUser = await new User({
      username: "test-user",
      mail: "test-user-mail@test.com",
      password: "the-test-password",
    }).save();
  });
  afterAll(async () => {
    await User.deleteMany({});
  });
  it("should return the updated user", async () => {
    const updated = await updateUser(seededUser, {
      username: "updated-user",
      mail: "updated-mail@test.com",
    });
    const expectedUserData = {
      ...getRelevantUserFields(seededUser),
      ...{
        username: "updated-user",
        mail: "updated-mail@test.com",
      },
    };
    const userInDb = await User.findById(seededUser._id);
    expect(getRelevantUserFields(updated)).toEqual(expectedUserData);
    expect(getRelevantUserFields(userInDb)).toEqual(expectedUserData);
  });

  it("should not update invalid data", async () => {
    const beforeUpdate = getRelevantUserFields(seededUser);
    const updateBad = updateUser(seededUser, {
      mail: "bad-mail",
      role: "unkown-role",
    });
    expect(updateBad).rejects.toThrow(mongoose.Error.ValidationError);
    const userInDb = await User.findById(seededUser._id);
    expect(getRelevantUserFields(userInDb)).toEqual(beforeUpdate);
  });
});
