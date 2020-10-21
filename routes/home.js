const router = require("express").Router();
const controllers = require("../controllers");
const isAuth = require("../utils/isAuth");

router.get("/", isAuth(true), controllers.home.get.home);
router.get("/home", isAuth(true), controllers.home.get.home);
router.get("/home/likes", isAuth(), controllers.home.get.sort);

module.exports = router;
