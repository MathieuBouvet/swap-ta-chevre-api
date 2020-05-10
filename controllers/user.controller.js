const withErrorDispatcher = require("../utils/withErrorDispatcherToExpress");
const userService = require("../services/user.service");
const getAccessToken = require("../services/accessToken.service").getFreshToken;
const { Http404 } = require("../utils/errors");
const roleOnRessource = require("../services/roleOnRessource.service");
const { ADMIN, AUTHOR } = require("../utils/roles");

exports.addUser = withErrorDispatcher(async (req, res) => {
  await userService.createUser(req.body);
  res.status(201).json();
});

exports.login = (req, res) => {
  const token = getAccessToken(req.user);
  res.cookies.set("accessToken", token, {
    secure: process.env.NODE_ENV === "production",
  });
  res.status(201).send();
};

exports.getUser = withErrorDispatcher(async (req, res) => {
  const user = await userService.findUserById(req.params.id, "-__v -password");
  if (user == null) {
    throw new Http404(`User ${req.params.id} not found`);
  }
  res.status(200).json(user);
});

exports.deleteUser = withErrorDispatcher(async (req, res) => {
  const user = await userService.findUserById(req.params.id);
  if (![ADMIN, AUTHOR].includes(roleOnRessource(req.user, "user", user))) {
    return res.status(403).send();
  }
  await userService.deleteUser(user._id);
  res.status(204).send();
});
