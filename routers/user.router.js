const router = require("express").Router();
const controller = require("../controllers/user.controller");

router.use("/", controller.addUser);
module.exports = router;
