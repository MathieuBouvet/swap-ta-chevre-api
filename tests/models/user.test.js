const User = require("../../models/user.js");

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
});
