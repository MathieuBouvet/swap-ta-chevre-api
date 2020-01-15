const User = require("../../models/user.js");
const mongoose = require("mongoose");

const getDefaultUser = () =>
  new User({
    username: "longenough",
    password: "longenoughpassword",
    mail: "test.the.mail@shouldpass.com",
  });

describe("User model", () => {
  describe("user validation", () => {
    const testUser = getDefaultUser();
    it("should allow a valid user", () => {
      expect(testUser.validateSync()).toBeUndefined();
    });
  });
  describe("username validation", () => {
    const testUser = getDefaultUser();
    it("should not allow undefined value", () => {
      testUser.username = undefined;
      expect(testUser.validateSync("username")).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
    it("should not allow a length < 8", () => {
      testUser.username = "__7char";
      expect(testUser.validateSync("username")).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
    it("should not allow a length > 50", () => {
      testUser.username = "_____________________________________________51char";
      expect(testUser.validateSync("username")).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
  });
  describe("mail validation", () => {
    const testUser = getDefaultUser();
    it("should not allow undefined value", () => {
      testUser.mail = undefined;
      expect(testUser.validateSync("mail")).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
    it("should not allow invalid email", () => {
      testUser.mail = "invalidmail";
      expect(testUser.validateSync("mail")).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
  });
  describe("password validation", () => {
    const testUser = getDefaultUser();
    it("should not allow undefined value", () => {
      testUser.password = undefined;
      expect(testUser.validateSync("password")).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
    it("should not allow empty value", () => {
      testUser.password = "";
      expect(testUser.validateSync("password")).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
    it("should not allow a password length < 8", () => {
      testUser.password = "__7char";
      expect(testUser.validateSync("password")).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
  });
  describe("phone number validation", () => {
    const testUser = getDefaultUser();
    it("should not allow invalid phone numbers", () => {
      testUser.phoneNumber = "45rt5";
      expect(testUser.validateSync("phoneNumber")).toBeInstanceOf(
        mongoose.Error.ValidationError
      );
    });
  });
});
