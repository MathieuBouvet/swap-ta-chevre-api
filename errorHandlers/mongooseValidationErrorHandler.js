const mongoose = require("mongoose");

function filterErrorDetails(mongooseError) {
  let filtered = {};
  for (let key in mongooseError) {
    const { kind, message, name } = mongooseError[key];
    filtered[key] = { kind, message, name };
  }
  return filtered;
}
module.exports = {
  handledErrorType: mongoose.Error.ValidationError,
  handler: (err, req, res) => {
    res.status(400).json({
      httpStatus: 400,
      httpMessage: "Bad Request",
      errorDetails: filterErrorDetails(err.errors),
    });
  },
};
