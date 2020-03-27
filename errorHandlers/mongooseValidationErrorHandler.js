const mongoose = require("mongoose");
module.exports = {
  handledErrorType: mongoose.Error.ValidationError,
  handler: (err, req, res) => {
    res.status(400).json({
      httpStatus: 400,
      httpMessage: "Bad Request",
      errorDetails: err.errors,
    });
  },
};
