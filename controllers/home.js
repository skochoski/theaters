const { Play } = require("../models");

module.exports = {
  get: {
    home(req, res) {
      Play.find({ isPublic: true })
        .lean()
        .then((plays) => {
          const guestPlays = plays
            .sort((a, b) => {
              return b.usersLiked.length - a.usersLiked.length;
            })
            .slice(0, 3);

          plays.sort((a, b) => {
            return b.createdAt - a.createdAt;
          });

          res.render("home/home", { plays, guestPlays });
        });
    },
    sort(req, res) {
      Play.find({ isPublic: true })
        .lean()
        .then((plays) => {
          plays.sort((a, b) => {
            return b.usersLiked.length - a.usersLiked.length;
          });

          res.render("home/home", { plays });
        });
    }
  },
};
