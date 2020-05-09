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

const getRelevantUserFields = (
  mongooseDocument,
  options = { includeId: true }
) => {
  let relevant = options.includeId
    ? {
        _id: mongooseDocument._id.toString(),
      }
    : {};
  for (let key in userSeed) {
    relevant[key] = mongooseDocument[key];
  }
  return relevant;
};

module.exports = {
  userSeed,
  userSeedWithPassword,
  badUserSeed,
  getRelevantUserFields,
};
