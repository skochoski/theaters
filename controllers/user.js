const { User } = require("../models");
const jwt = require("../utils/jwt");
const { cookie } = require("../config/config");

module.exports = {
  get: {
    login(req, res) {
      res.render("user/login");
    },
    register(req, res) {
      res.render("user/register");
    },
    logout(req, res) {
      req.user = null;
      res.clearCookie(cookie).clearCookie("x-auth-user").redirect("/");
    },
  },
  post: {
    login(req, res) {
      const { username, password } = req.body;
      res.locals = {
        previousUsername: username,
        previousPassword: password,
      };

      User.findOne({ username })
        .then((user) => {
          return Promise.all([
            user,
            user ? user.matchPassword(password) : false,
          ]);
        })
        .then(([user, match]) => {
          if (!user) {
            res.render("user/login", {
              ...res.locals,
              errorMessages: [
                "No such username in our database!\nPlease register",
              ],
            });
            return;
          }

          if (!match) {
            res.render("user/login", {
              ...res.locals,
              errorMessages: ["Wrong password!\nPlease try again"],
            });
            return;
          }

          const token = jwt.createToken(user);
          res
            .cookie(cookie, token, { maxAge: 3600000 })
            .cookie("x-auth-user", user.username, { maxAge: 3600000 })
            .redirect("/home");
        })
        .catch(console.error);
    },
    register(req, res) {
      const { username, password, repeatPassword } = req.body;
      res.locals = {
        previousUsername: username,
        previousPassword: password,
        previousRepeatPassword: repeatPassword,
      };

      if (password !== repeatPassword) {
        res.render("user/register", {
          ...res.locals,
          errorMessages: ["Password and Repeat Password don't match!"],
        });
        return;
      }

      User.create({ username, password })
        .then(() => {
          res.redirect("/user/login");
        })
        .catch((err) => {
          if (err.name === "MongoError") {
            res.locals = {
              ...res.locals,
              errorMessages: ["This username is already registered!"],
            };
          }

          if (err.name === "ValidationError") {
            res.locals = {
              ...res.locals,
              errorMessages: Object.values(err.errors).map((e) => e.message),
            };
          }

          res.render("user/register", res.locals);
        });
    },
  },
};
