const Post = require('../models/Post');
const { spawn } = require('child_process');

exports.getMonthlyStats = async (req, res) => {
  const stats = await Post.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
        totalViews: { $sum: '$views' },
        totalPosts: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  res.json(stats);
};

exports.getTopPosts = async (req, res) => {
  const posts = await Post.find().sort({ views: -1 }).limit(5);
  res.json(posts);
};

exports.fetchNow = (req, res) => {
  const python = spawn('python', ['./utils/fetchTelegramData.py']);
  python.stdout.on('data', (data) => console.log(data.toString()));
  python.stderr.on('data', (data) => console.error(data.toString()));
  python.on('close', (code) => res.json({ status: 'done', code }));
};