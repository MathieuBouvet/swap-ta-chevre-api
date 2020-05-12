const mongooseValidationErrorHandler = require("./mongooseValidationErrorHandler");
const http401Handler = require("./http401Handler");
const http403Handler = require("./http403Handler");
const http404Handler = require("./http404Handler");

const registeredSpecificHandlers = [
  mongooseValidationErrorHandler,
  http401Handler,
  http403Handler,
  http404Handler,
];

const toErrorHandlerMiddleware = (specificErrorHandler) => {
  return (err, req, res, next) => {
    if (err instanceof specificErrorHandler.handledErrorType) {
      specificErrorHandler.handler(err, req, res, next);
    } else {
      next(err);
    }
  };
};

module.exports = registeredSpecificHandlers.map(toErrorHandlerMiddleware);
