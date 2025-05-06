const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  message_id: { type: Number, unique: true },
  views: Number,
  date: Date
});

module.exports = mongoose.model("Post", postSchema);
