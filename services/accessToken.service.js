const jwt = require("jsonwebtoken");
const InvalidArgumentError = require("../utils/errors/InvalidArgumentError");

exports.getFreshToken = function (user, expiresIn = "1h") {
  if (!user || !user._id) {
    throw new InvalidArgumentError(
      "user field must be an object with an _id property"
    );
  }
  return jwt.sign({}, process.env.JWT_SECRET_KEY, {
    expiresIn,
    subject: user._id.toString(),
  });
};
