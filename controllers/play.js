const { Play, User } = require("../models");

module.exports = {
  get: {
    details(req, res) {
      const { id } = req.params;

      Play.findById(id)
        .populate("usersLiked")
        .lean()
        .then((play) => {
          const currentUsername = req.user.username;
          const userIsCreator = currentUsername === play.creator;
          const alreadyLiked = !!play.usersLiked.find(
            (user) => user.username === currentUsername
          );

          res.render("play/details", { play, userIsCreator, alreadyLiked });
        })
        .catch((err) => console.log(err));
    },
    create(req, res) {
      res.render("play/create");
    },
    edit(req, res) {
      const { id } = req.params;

      Play.findById(id)
        .lean()
        .then((play) => {
          res.render("play/edit", { play });
        })
        .catch((err) => console.log(err));
    },
    delete(req, res) {
      const { id } = req.params;

      Play.findByIdAndRemove(id).then(() => {
        res.redirect("/home");
      });
    },
    like(req, res) {
      const playId = req.params.id;
      const userId = req.user._id;

      Promise.all([
        Play.updateOne({ _id: playId }, { $push: { usersLiked: userId } }),
        User.updateOne({ _id: userId }, { $push: { likedPlays: playId } }),
      ]).then(([updatedPlay, updatedUser]) => {
        res.redirect(`/play/details/${playId}`);
      });
    },
  },

  post: {
    create(req, res) {
      const { title, description, imageUrl, public } = req.body;
      const { username } = req.user;

      res.locals = {
        previousTitle: title,
        previousDescription: description,
        previousImageUrl: imageUrl,
      };

      Play.create({
        title,
        description,
        imageUrl,
        isPublic: !!public,
        creator: username,
      })
        .then(() => {
          res.redirect("/home");
        })
        .catch((err) => {
          if (err.name === "MongoError") {
            res.locals = {
              ...res.locals,
              errorMessages: ["This play is already registered!"],
            };
          }

          if (err.name === "ValidationError") {
            res.locals = {
              ...res.locals,
              errorMessages: Object.values(err.errors).map((e) => e.message),
            };
          }

          res.render("play/create", res.locals);
        });
    },
    edit(req, res) {
      const { id } = req.params;
      const { title, description, imageUrl, public } = req.body;

      Play.updateOne(
        { _id: id },
        { title, description, imageUrl, isPublic: !!public },
        { runValidators: true }
      )
        .then(() => {
          res.redirect(`/play/details/${id}`);
        })
        .catch((err) => {
          Play.findById(id)
            .lean()
            .then((play) => {
              let errorMessages;

              if (err.name === "MongoError") {
                errorMessages = ["This play is already registered!"];
                res.render("play/edit", { play, errorMessages });
                return;
              }

              if (err.name === "ValidationError") {
                errorMessages = Object.values(err.errors).map((e) => e.message);
                res.render("play/edit", { play, errorMessages });
                return;
              }

              next(err);
            });
        });
    },
  },
};
