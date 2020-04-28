/**
 * @jest-environment mongodb
 */

const User = require("../../models/user.model");
const dbUtils = require("../../test-utils/dbUtils");

describe("password comparison", () => {
  beforeAll(dbUtils.setup);
  afterAll(dbUtils.teardown);

  it("should check given password", async () => {
    const userData = {
      username: "thetestuser",
      password: "theuserpassword",
      mail: "theusermail@test-mail.com",
    };
    const user = new User(userData);
    await user.save();

    const checkPassword = await user.isMyPassword("theuserpassword");
    const checkPassword2 = await user.isMyPassword("notmypassword");
    expect(checkPassword).toBe(true);
    expect(checkPassword2).toBe(false);
  });
});
