const Joi = require('joi');
const User = require('../models/User');
const githubService = require('../services/githubService');

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  githubUsername: Joi.string(),
});

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('badges', 'name description icon');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      githubUsername: user.githubUsername,
      score: user.score,
      points: user.points,
      badges: user.badges,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { error } = updateProfileSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, githubUsername } = req.body;

    if (name) user.name = name;
    if (githubUsername !== undefined) user.githubUsername = githubUsername;

    // If GitHub username changed, update score
    if (githubUsername && githubUsername !== user.githubUsername) {
      try {
        const analysis = await githubService.analyzeProfile(githubUsername);
        user.score = analysis.score;
      } catch (error) {
        // GitHub analysis failed, but don't block profile update
        console.error('GitHub analysis failed:', error.message);
      }
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      githubUsername: updatedUser.githubUsername,
      score: updatedUser.score,
      points: updatedUser.points,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').populate('badges', 'name icon');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
};