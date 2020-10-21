const router = require("express").Router();
const controllers = require("../controllers");
const isAuth = require("../utils/isAuth");

router.get("/register", controllers.user.get.register);
router.get("/login", controllers.user.get.login);
router.get("/logout", isAuth(), controllers.user.get.logout);

router.post("/register", controllers.user.post.register);
router.post("/login", controllers.user.post.login);

module.exports = router;
