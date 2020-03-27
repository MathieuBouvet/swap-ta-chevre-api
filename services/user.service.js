const User = require("../models/user.model");
const InvalidArgumentError = require("../utils/errors/InvalidArgumentError");
exports.createUser = async function(userData) {
  if (
    typeof userData !== "object" ||
    userData === null ||
    Array.isArray(userData)
  ) {
    throw new InvalidArgumentError(
      "userata parameter should be an object describing a user."
    );
  }
  return await new User(userData).save();
};
