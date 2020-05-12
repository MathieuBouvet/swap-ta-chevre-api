const withErrorDispatcher = require("../utils/withErrorDispatcherToExpress");
const userService = require("../services/user.service");
const getAccessToken = require("../services/accessToken.service").getFreshToken;
const { Http403, Http404 } = require("../utils/errors");
const roleOnRessource = require("../services/roleOnRessource.service");
const fieldsAuthorization = require("../services/fieldsAuthorization.service");
const { ADMIN, AUTHOR, USER } = require("../utils/roles");

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

exports.updateUser = withErrorDispatcher(async (req, res) => {
  const userRessource = await userService.findUserById(req.params.id, "-__v");
  const role = roleOnRessource(req.user, "user", userRessource);
  if (role === USER) {
    throw new Http403("Insufficient rights to update this user");
  }
  const writeAuthorization = fieldsAuthorization("user", role, "write");
  const readAuthorization = fieldsAuthorization("user", role, "read");
  const authorizedFields = writeAuthorization(req.body);
  const updated = await userService.updateUser(userRessource, authorizedFields);
  const preparedForSending = readAuthorization(
    updated.toObject({
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    })
  );
  res.status(200).json(preparedForSending);
});
