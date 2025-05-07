const express = require('express');
const router = express.Router();
const { getMonthlyStats, getTopPosts, fetchNow } = require('../controllers/postController');

router.get('/monthly', getMonthlyStats);
router.get('/top', getTopPosts);
router.get('/fetch-now', fetchNow);

module.exports = router;
