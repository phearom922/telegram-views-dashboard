const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  message_id: Number,
  date: Date,
  views: Number,
  url: String,
});

module.exports = mongoose.model('Post', PostSchema);