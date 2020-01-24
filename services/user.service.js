const InvalidArgumentError = require("../utils/errors/InvalidArgumentError");
exports.createUser = async function(userData) {
  if (
    typeof userData !== "object" ||
    userData === null ||
    Array.isArray(userData)
  ) {
    throw new InvalidArgumentError(
      "userdata parameter should be an object describing a user."
    );
  }
};
