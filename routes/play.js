const router = require("express").Router();
const controllers = require("../controllers");
const isAuth = require("../utils/isAuth");

router.get("/details/:id", isAuth(), controllers.play.get.details);
router.get("/create", isAuth(), controllers.play.get.create);
router.post("/create", isAuth(), controllers.play.post.create);
router.get("/edit/:id", isAuth(), controllers.play.get.edit);
router.post("/edit/:id", isAuth(), controllers.play.post.edit);
router.get("/delete/:id", isAuth(), controllers.play.get.delete);
router.get("/like/:id", isAuth(), controllers.play.get.like);

module.exports = router;
