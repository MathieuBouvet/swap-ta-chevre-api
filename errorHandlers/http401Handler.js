const { Http401 } = require("../utils/errors");

module.exports = {
  handledErrorType: Http401,
  handler: (err, req, res) => {
    res.status(401).json({
      httpStatus: 401,
      httpMessage: "Unauthorized",
      errorDetails: err.message,
    });
  },
};
