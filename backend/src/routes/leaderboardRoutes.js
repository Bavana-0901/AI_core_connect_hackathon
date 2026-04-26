const express = require('express');
const { getLeaderboard, getUserStats } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Require authentication

router.get('/', getLeaderboard);
router.get('/stats', getUserStats);

module.exports = router;