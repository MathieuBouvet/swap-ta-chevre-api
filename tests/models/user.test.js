const User = require("../../models/user.js");
const mongoose = require("mongoose");

describe("User model", () => {
  describe("User fields", () => {
    const testUser = new User({
      username: "test_username",
      password: "test_password",
      mail: "test_mail",
    });
    it("should have a username", () => {
      expect(testUser.username).toBeDefined();
    });
    it("should have a password", () => {
      expect(testUser.password).toBeDefined();
    });
    it("should have a mail adress", () => {
      expect(testUser.mail).toBeDefined();
    });
  });
  describe("username validation", () => {
    const testUser = new User({
      username: undefined,
      password: "test",
      mail: "test",
    });
    it("should not allow undefined", () => {
      expect(testUser.validateSync()).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
    it("should not allow a length < 8", () => {
      testUser.username = "short";
      expect(testUser.validateSync()).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
    it("should not allow a length > 50", () => {
      testUser.username =
        "looooooooooooooooooooooooooooooooooooooooooooog username";
      expect(testUser.validateSync()).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
  });
});
