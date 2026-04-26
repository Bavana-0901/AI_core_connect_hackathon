const express = require('express');
const { analyzeProfile } = require('../controllers/githubController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Require authentication
router.post('/analyze', analyzeProfile);

module.exports = router;