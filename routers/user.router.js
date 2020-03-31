const router = require("express").Router();
const controller = require("../controllers/user.controller");
const localAuthentication = require("../middelwares/localAuthentication");

router.post("/", controller.addUser);
router.post("/login", localAuthentication, controller.login);
module.exports = router;
