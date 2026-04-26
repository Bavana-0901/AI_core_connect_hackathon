const Joi = require('joi');
const githubService = require('../services/githubService');
const User = require('../models/User');

const analyzeSchema = Joi.object({
  username: Joi.string().required(),
});

const analyzeProfile = async (req, res) => {
  try {
    const { error } = analyzeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username } = req.body;

    const analysis = await githubService.analyzeProfile(username);

    // Update user's score if it's their own profile
    if (req.user.githubUsername === username) {
      await User.findByIdAndUpdate(req.user._id, { score: analysis.score });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  analyzeProfile,
};