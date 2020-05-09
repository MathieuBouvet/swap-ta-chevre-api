const passport = require("passport");
const { Http401 } = require("../utils/errors");

module.exports = (options = { strategy: "jwt" }) => (req, res, next) =>
  passport.authenticate(
    options.strategy,
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Http401(info.message));
      }
      req.user = user;
      return next();
    }
  )(req, res, next);
