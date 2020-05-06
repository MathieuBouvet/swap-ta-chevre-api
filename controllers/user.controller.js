const errorDispatcher = require("../utils/withErrorDispatcherToExpress");
const userService = require("../services/user.service");
const getAccessToken = require("../services/accessToken.service").getFreshToken;
const Http404 = require("../utils/errors/Http404");

exports.addUser = errorDispatcher(async (req, res) => {
  await userService.createUser(req.body);
  res.status(201).json();
});

exports.login = (req, res) => {
  const token = getAccessToken(req.user._id);
  res.cookies.set("accessToken", token, {
    secure: process.env.NODE_ENV === "production",
  });
  res.status(201).send();
};

exports.getUser = errorDispatcher(async (req, res) => {
  const user = await userService.findUserById(req.params.id, "-__v -password");
  if (user == null) {
    throw new Http404(`User ${req.params.id} not found`);
  }
  res.status(200).json(user);
});
