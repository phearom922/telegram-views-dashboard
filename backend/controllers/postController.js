const Post = require('../models/Post');
const { spawn } = require('child_process');
const path = require('path'); // เพิ่มบรรทัดนี้

// backend/controllers/postController.js
exports.getMonthlyStats = async (req, res) => {
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3); // คำนวณวันที่ย้อนหลัง 3 เดือน

    const stats = await Post.aggregate([
      {
        $match: {
          date: { $gte: threeMonthsAgo } // กรองข้อมูลที่มี date >= 3 เดือนย้อนหลัง
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          totalViews: { $sum: '$views' },
          totalPosts: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    // console.log('Monthly Stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error in getMonthlyStats:', error);
    res.status(500).json({ error: 'Failed to fetch monthly stats' });
  }
};

exports.getTopPosts = async (req, res) => {
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const posts = await Post.find({
      date: { $gte: threeMonthsAgo } // กรองโพสต์ 3 เดือนย้อนหลัง
    })
      .sort({ views: -1 })
      .limit(5);
    // console.log('Top Posts:', posts);
    res.json(posts);
  } catch (error) {
    console.error('Error in getTopPosts:', error);
    res.status(500).json({ error: 'Failed to fetch top posts' });
  }
};

// backend/controllers/postController.js
exports.fetchNow = (req, res) => {
  const path = require('path');
  const python = spawn('python', [path.join(__dirname, '../utils/fetchTelegramData.py')]);
  python.stdout.on('data', (data) => console.log(`Python stdout: ${data}`));
  python.stderr.on('data', (data) => console.error(`Python stderr: ${data}`));
  python.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
    res.json({ status: 'done', code });
  });
  python.on('error', (err) => {
    console.error('Failed to start Python script:', err);
    res.status(500).json({ status: 'error', message: err.message });
  });
};