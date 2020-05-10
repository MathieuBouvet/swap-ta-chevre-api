const withArgsFlexibility = (func) => (...args) =>
  args.reduce((partial, arg) => {
    if (typeof partial !== "function") {
      return partial;
    }
    return partial(arg);
  }, func);

module.exports = withArgsFlexibility;
