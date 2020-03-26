const mongooseValidationErrorHandler = require("./mongooseValidationErrorHandler");
const registeredSpecificHandlers = [mongooseValidationErrorHandler];

const toErrorHandlerMiddleware = specificErrorHandler => {
  return (err, req, res, next) => {
    if (err instanceof specificErrorHandler.handledErrorType) {
      specificErrorHandler.handler(err, req, res, next);
    } else {
      next(err);
    }
  };
};

module.exports = registeredSpecificHandlers.map(toErrorHandlerMiddleware);
