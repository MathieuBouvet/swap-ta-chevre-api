const { Http403 } = require("../utils/errors");

module.exports = {
  handledErrorType: Http403,
  handler: (err, req, res) => {
    res.status(403).json({
      httpStatus: 403,
      httpMessage: "Forbidden",
      errorDetails: "Insufficient rights to update this user",
    });
  },
};
