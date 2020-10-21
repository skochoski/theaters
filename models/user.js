const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { String, ObjectId } = Schema.Types;
const bcrypt = require("bcrypt");
const saltRounds = 8;

const userSchema = new Schema({
  username: {
    type: String,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9]{3,}$/.test(value);
      },
      message: "The username should be at least 3 characters long and should contain only alphanumeric characters",
    },
    required: [true, "Valid username is required!"],
    unique: true,
  },

  password: {
    type: String,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9]{3,}$/.test(value);
      },
      message: "The password should be at least 3 characters long and should contain only alphanumeric characters",
    },
    required: [true, "Valid password is required!"],
    unique: true,
  },

  likedPlays: [
    {
      type: ObjectId,
      ref: "Play",
    },
  ],
});

userSchema.methods = {
  matchPassword: function (password) {
    return bcrypt.compare(password, this.password);
  },
};

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        next(err);
        return;
      }
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) {
          next(err);
          return;
        }
        this.password = hash;
        next();
      });
    });
    return;
  }
  next();
});

module.exports = new model("User", userSchema);
