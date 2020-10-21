const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { String, Number, ObjectId } = Schema.Types;

const playSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required!"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Description is required!"],
  },
  imageUrl: {
    type: String,
    required: [true, "Image url is required!"],
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
  creator: {
    type: String,
  },
  usersLiked: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
});

module.exports = new model("Play", playSchema);
