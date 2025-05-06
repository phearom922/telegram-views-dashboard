const Post = require('../models/Post');

const getTopPosts = async (req, res) => {
  try {
    const topPosts = await Post.find()
      .sort({ views: -1 })
      .limit(5); // ปรับจำนวนโพสต์ได้ตามต้องการ

    const channelUsername = process.env.CHANNEL_USERNAME;

    const postsWithEmbedInfo = topPosts.map(post => ({
      message_id: post.message_id,
      views: post.views,
      channel_username: channelUsername,
    }));

    res.json(postsWithEmbedInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch top posts' });
  }
};

module.exports = { getTopPosts };
