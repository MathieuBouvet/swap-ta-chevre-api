const router = require("express").Router();
const controller = require("../controllers/user.controller");
const authentication = require("../middelwares/authentication");

router.post("/", controller.addUser);
router.post("/login", authentication({ strategy: "local" }), controller.login);
router.get("/:id", controller.getUser);
router.delete("/:id", authentication(), controller.deleteUser);
router.patch("/:id", controller.updateUser);
module.exports = router;
