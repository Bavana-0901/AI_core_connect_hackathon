const Joi = require('joi');
const Submission = require('../models/Submission');
const Task = require('../models/Task');
const gamificationService = require('../services/gamificationService');

const submitProofSchema = Joi.object({
  taskId: Joi.string().hex().length(24).required(),
  proof: Joi.string().min(1).required(),
});

const reviewSubmissionSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required(),
});

const submitProof = async (req, res) => {
  try {
    const { error } = submitProofSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { taskId, proof } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (!task.assignedTo.includes(req.user._id)) {
      return res.status(403).json({ message: 'Task not assigned to you' });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({ userId: req.user._id, taskId });
    if (existingSubmission) {
      return res.status(400).json({ message: 'Already submitted for this task' });
    }

    const submission = await Submission.create({
      userId: req.user._id,
      taskId,
      proof,
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubmissions = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'ambassador') {
      query.userId = req.user._id;
    }

    const submissions = await Submission.find(query)
      .populate('userId', 'name email')
      .populate('taskId', 'title points')
      .populate('reviewedBy', 'name')
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reviewSubmission = async (req, res) => {
  try {
    const { error } = reviewSubmissionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { status } = req.body;

    const submission = await Submission.findById(req.params.id)
      .populate('taskId')
      .populate('userId');

    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.status = status;
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();

    await submission.save();

    // Award points if approved
    if (status === 'approved') {
      await gamificationService.awardPoints(submission.userId._id, submission.taskId.points, 'Task completion');
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitProof,
  getSubmissions,
  reviewSubmission,
};