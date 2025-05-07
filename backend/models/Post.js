const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  message_id: Number,
  views: Number,
  date: Date,
  channel_username: String
});

module.exports = mongoose.model('Post', postSchema);

