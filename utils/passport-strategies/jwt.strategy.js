const JwtStrategy = require("passport-jwt").Strategy;

const options = {
  secretOrKey: process.env.JWT_SECRET_KEY,
  jwtFromRequest: (req) => {
    if (req && req.cookies && req.cookies.accessToken) {
      return req.cookies.accessToken;
    }
    return null;
  },
};

module.exports = new JwtStrategy(options, (jwtPayload, done) => {
  if (jwtPayload.sub) {
    done(null, jwtPayload);
  }
  done(null, false, { message: "An access token must have a 'subject' claim" });
});
