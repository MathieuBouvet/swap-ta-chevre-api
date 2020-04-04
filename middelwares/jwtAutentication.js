const passport = require("passport");
const Http401 = require("../utils/errors/Http401");

module.exports = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Http401(info.message));
    }
    req.userToken = user;
    return next();
  })(req, res, next);
};
