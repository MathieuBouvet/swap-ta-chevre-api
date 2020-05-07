const JwtStrategy = require("passport-jwt").Strategy;

const options = {
  secretOrKey: process.env.JWT_SECRET_KEY,
  jwtFromRequest: (req) => {
    if (req && req.cookies) {
      return req.cookies.get("accessToken");
    }
    return null;
  },
};

module.exports = new JwtStrategy(options, (jwtPayload, done) => {
  if (jwtPayload.sub != null) {
    return done(null, jwtPayload);
  }
  done(null, false, { message: "An access token must have a 'subject' claim" });
});
