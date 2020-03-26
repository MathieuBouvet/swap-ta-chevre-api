const errorDispatcher = require("../utils/withErrorDispatcherToExpress");
const userService = require("../services/user.service");

exports.addUser = errorDispatcher(async (req, res) => {
  await userService.createUser(req.body);
  res.status(201).json();
});
