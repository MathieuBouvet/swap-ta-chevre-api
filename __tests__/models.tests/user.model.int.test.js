/**
 * @jest-environment mongodb
 */

const User = require("../../models/user.model");
const dbUtils = require("../../test-utils/dbUtils");
const { userSeedWithPassword } = require("../../test-utils/userSeedData");

beforeAll(dbUtils.setup);
afterAll(dbUtils.teardown);

it("should check given password", async () => {
  const user = new User(userSeedWithPassword);
  await user.save();

  const checkPassword = await user.isMyPassword("test-user-password");
  const checkPassword2 = await user.isMyPassword("notmypassword");
  expect(checkPassword).toBe(true);
  expect(checkPassword2).toBe(false);
});
