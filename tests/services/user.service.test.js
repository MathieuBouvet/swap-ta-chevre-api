const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const createUser = require("../../services/user.service").createUser;
const User = require("../../models/user");

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    }
  );
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

const userData = {
  username: "thetestuser",
  password: "theuserpassword",
  mail: "theusermail@test-mail.com",
};

describe("User creation service", () => {
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

  it("should return a user", async () => {
    const userDocument = await createUser(userData);
    expect(userDocument).toBeInstanceOf(User);
  });
});
