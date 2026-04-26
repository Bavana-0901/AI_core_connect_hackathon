const express = require('express');
const { getProfile, updateProfile, getAllUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All user routes require authentication

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/', authorize('admin'), getAllUsers);

module.exports = router;