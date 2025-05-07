const express = require('express');
const router = express.Router();
const { getMonthlyStats, getTopPosts } = require('../controllers/postController');

router.get('/monthly', getMonthlyStats);
router.get('/top', getTopPosts);

module.exports = router;
