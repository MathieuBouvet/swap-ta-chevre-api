const User = require("../../models/user.js");
const mongoose = require("mongoose");

const getDefaultUser = () =>
  new User({
    username: "longenough",
      password: "test",
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
});
