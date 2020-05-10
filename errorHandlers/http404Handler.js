const { Http404 } = require("../utils/errors");

module.exports = {
  handledErrorType: Http404,
  handler: (err, req, res) => {
    res.status(404).json({
      httpStatus: 404,
      httpMessage: "Not Found",
      errorDetails: err.message,
    });
  },
};
