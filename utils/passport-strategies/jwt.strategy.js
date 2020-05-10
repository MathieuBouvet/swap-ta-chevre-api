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
  if (jwtPayload.sub == null || jwtPayload.role == null) {
    return done(null, false, {
      message: "An access token must have a 'subject' and a 'role' claim",
    });
  }
  return done(null, jwtPayload);
});
