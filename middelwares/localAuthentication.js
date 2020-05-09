const passport = require("passport");
const { Http401 } = require("../utils/errors");

module.exports = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Http401(info));
    }
    req.user = user;
    return next();
  })(req, res, next);
};
