const express = require('express');
const router = express.Router();
const { getLeaderboard, getUserStats } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/leaderboard', getLeaderboard);
router.get('/stats', protect, getUserStats);

module.exports = router;
