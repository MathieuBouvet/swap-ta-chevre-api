const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const saltWorkFactor = Number.parseInt(process.env.SALT_ROUNDS);

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 8,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  mail: {
    type: String,
    required: true,
    match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  phoneNumber: {
    type: String,
    match: /^((\+)33|0)[1-9](\d{2}){4}$/,
  },
});

userSchema.pre("save", async function() {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, saltWorkFactor);
  }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
