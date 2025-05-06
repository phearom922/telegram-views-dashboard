const express = require("express");
const Post = require("../models/Post");
const router = express.Router();

router.post("/import", async (req, res) => {
  try {
    const posts = req.body.posts;
    for (const post of posts) {
      await Post.updateOne(
        { message_id: post.message_id },
        post,
        { upsert: true }
      );
    }
    res.json({ success: true, imported: posts.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/monthly", async (req, res) => {
  const result = await Post.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
        totalViews: { $sum: "$views" }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  res.json(result);
});




router.get("/top", async (req, res) => {
  const posts = await Post.find().sort({ views: -1 }).limit(10);
  res.json(posts);
});

module.exports = router;
