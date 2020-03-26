const userService = require("../services/user.service");

exports.addUser = async (req, res) => {
  await userService.createUser(req.body);
  res.status(201).json();
};
