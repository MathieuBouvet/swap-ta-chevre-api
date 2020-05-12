const LocalStrategy = require("passport-local").Strategy;
const findUser = require("../../services/user.service").findUserByName;

module.exports = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await findUser(username);
    if (!user || !(await user.isMyPassword(password))) {
      return done(null, false, { message: "Invalid username or password" });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});
