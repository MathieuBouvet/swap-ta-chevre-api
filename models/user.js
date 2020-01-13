const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 50,
  },
  password: String,
  mail: String,
});

module.exports = mongoose.model("User", userSchema);
