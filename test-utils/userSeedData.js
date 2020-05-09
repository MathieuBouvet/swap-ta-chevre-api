const userSeed = {
  username: "test-user",
  mail: "test-user@testmail.com",
  phoneNumber: "0945124578",
};

const userSeedWithPassword = {
  ...userSeed,
  password: "test-user-password",
};

const badUserSeed = {
  username: "bad",
  password: "bad",
  mail: "bad",
  phoneNumber: "bad",
};

module.exports = {
  userSeed,
  userSeedWithPassword,
  badUserSeed,
};
