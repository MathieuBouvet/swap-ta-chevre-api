const User = require("../../models/user.js");
const mongoose = require("mongoose");

const getDefaultUser = () =>
  new User({
    username: "longenough",
    password: "longenoughpassword",
    mail: "test.the.mail@shouldpass.com",
  });

describe("User model", () => {
  describe("username validation", () => {
    const testUser = getDefaultUser();
    it("should not allow undefined value", () => {
      testUser.username = undefined;
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
  describe("mail validation", () => {
    const testUser = getDefaultUser();
    it("should not allow undefined value", () => {
      testUser.mail = undefined;
      expect(testUser.validateSync()).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
    it("should not allow invalid email", () => {
      testUser.mail = "invalidmail";
      expect(testUser.validateSync()).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
  });
  describe("password validation", () => {
    const testUser = getDefaultUser();
    it("should not allow undefined value", () => {
      testUser.password = undefined;
      expect(testUser.validateSync()).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
    it("should not allow empty value", () => {
      testUser.password = "";
      expect(testUser.validateSync()).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
    it("should not allow a password length < 8", () => {
      testUser.password = "short";
      expect(testUser.validateSync()).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
  });
});
