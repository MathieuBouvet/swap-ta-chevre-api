const LocalStrategy = require("passport-local").Strategy;
const findUser = require("../../services/user.service").findUserByName;

module.exports = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await findUser(username);
    if (!user) {
      return done(null, false);
    }
    if (await !user.isMyPassword(password)) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});
