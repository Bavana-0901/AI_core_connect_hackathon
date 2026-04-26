const express = require('express');
const { getAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Require authentication
router.get('/', authorize('admin'), getAnalytics);

module.exports = router;