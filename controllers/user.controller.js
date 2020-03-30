const errorDispatcher = require("../utils/withErrorDispatcherToExpress");
const userService = require("../services/user.service");

exports.addUser = errorDispatcher(async (req, res) => {
  await userService.createUser(req.body);
  res.status(201).json();
});

exports.login = (req, res) => {
  res.status(501).json({ message: "Not Implemented" });
};
