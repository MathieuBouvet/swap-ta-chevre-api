const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  mail: String,
});

module.exports = mongoose.model("User", userSchema);
