const express = require("express");
const cookieParser = require("cookie-parser");
const handlebars = require("express-handlebars");
const { cookie } = require("../config/config");

module.exports = (app) => {
  app.engine(
    "hbs",
    handlebars({
      layoutsDir: "views",
      defaultLayout: "base-layout",
      partialsDir: "views/partials",
      extname: "hbs",
    })
  );

  app.set("view engine", "hbs");
  app.use(express.static("public"));
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    res.locals.isLoggedIn = req.cookies[cookie] !== undefined;
    res.locals.username = req.cookies["x-auth-user"];
    next();
  });

  app.use(function (err, req, res, next) {
    console.error(err);
    res.render("500.hbs", { errorMessage: err.message });
  });
};
