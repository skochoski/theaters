const routers = require("../routes");

module.exports = (app) => {
  app.use("/", routers.home);
  app.use("/home", routers.home);
  app.use("/user", routers.user);
  app.use("/play", routers.play);

  app.use("*", (req, res, next) => {
    res.render("404.hbs");
  });
};
