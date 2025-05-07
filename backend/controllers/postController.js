const Post = require('../models/Post');

// ✅ เพิ่มฟังก์ชันรวมยอดรายเดือน: totalViews + totalPosts
const getMonthlyStats = async (req, res) => {
  try {
    const stats = await Post.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$date" }
          },
          totalViews: { $sum: "$views" },
          totalPosts: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch monthly stats' });
  }
};

const getTopPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ views: -1 }).limit(5);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch top posts' });
  }
};

module.exports = {
  getMonthlyStats,
  getTopPosts
};
