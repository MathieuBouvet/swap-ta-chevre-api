const router = require("express").Router();
const controller = require("../controllers/user.controller");
const basicAuthentication = require("../middelwares/basic-auth.middleware");

router.post("/", controller.addUser);
router.post("/login", basicAuthentication, controller.login);
module.exports = router;
