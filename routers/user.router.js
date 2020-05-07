const router = require("express").Router();
const controller = require("../controllers/user.controller");
const localAuthentication = require("../middelwares/localAuthentication");
const authentication = require("../middelwares/jwtAutentication");

router.post("/", controller.addUser);
router.post("/login", localAuthentication, controller.login);
router.get("/:id", controller.getUser);
router.delete("/:id", authentication, controller.deleteUser);
module.exports = router;
