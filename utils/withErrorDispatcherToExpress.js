const { InvalidArgumentError } = require("./errors");

module.exports = (controllerMethod) => {
  if (typeof controllerMethod !== "function") {
    throw new InvalidArgumentError(
      `argument "controllerMethod" must be of type "function"`
    );
  }
  return async (req, res, next) => {
    try {
      await controllerMethod(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
