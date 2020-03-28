const User = require("../models/user.model");
const InvalidArgumentError = require("../utils/errors/InvalidArgumentError");
const MongooseCastError = require("mongoose").Error.CastError;

const isNotCastableIdError = error =>
  error instanceof MongooseCastError && error.kind == "ObjectId";

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

exports.findUserById = async function(userId, projection, options) {
  try {
    return await User.findById(userId, projection, options);
  } catch (err) {
    if (isNotCastableIdError(err)) {
      return null;
    }
    throw err;
  }
};
