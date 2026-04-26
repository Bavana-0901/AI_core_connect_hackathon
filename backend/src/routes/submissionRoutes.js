const express = require('express');
const { submitProof, getSubmissions, reviewSubmission } = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All submission routes require authentication

router.route('/')
  .get(getSubmissions)
  .post(submitProof);

router.put('/:id/review', authorize('admin'), reviewSubmission);

module.exports = router;