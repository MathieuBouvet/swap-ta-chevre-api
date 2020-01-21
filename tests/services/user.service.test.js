const mongoose = require("mongoose");
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

describe("User creation service", () => {
  it("should save user in database", async () => {
    const userData = {
      username: "thetestuser",
      password: "theuserpassword",
      mail: "theusermail@test-mail.com",
    };
    const userDocument = await createUser(userData);
    const userInDataBase = await User.findById(userDocument._id);
    expect(userInDataBase.username).toBe(userData.username);
    expect(userInDataBase.mail).toBe(userData.mail);
  });
});
