const User = require('../models/User');
const Task = require('../models/Task');
const Submission = require('../models/Submission');

const getAnalytics = async (req, res) => {
  try {
    // Only admins can view analytics
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const totalUsers = await User.countDocuments({ role: 'ambassador' });
    const totalTasks = await Task.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const approvedSubmissions = await Submission.countDocuments({ status: 'approved' });

    const users = await User.find({ role: 'ambassador' }).select('points score');
    const avgPoints = users.reduce((sum, user) => sum + user.points, 0) / users.length || 0;
    const avgScore = users.reduce((sum, user) => sum + user.score, 0) / users.length || 0;

    const tasks = await Task.find().populate('assignedTo');
    const totalAssignedTasks = tasks.reduce((sum, task) => sum + task.assignedTo.length, 0);

    const engagementRate = totalAssignedTasks > 0 ? (totalSubmissions / totalAssignedTasks) * 100 : 0;

    // ROI calculation: points awarded vs tasks created
    const totalPointsAwarded = users.reduce((sum, user) => sum + user.points, 0);
    const roi = totalTasks > 0 ? (totalPointsAwarded / totalTasks) * 100 : 0;

    res.json({
      overview: {
        totalUsers,
        totalTasks,
        totalSubmissions,
        approvedSubmissions,
        engagementRate: Math.round(engagementRate * 100) / 100,
        roi: Math.round(roi * 100) / 100,
      },
      averages: {
        avgPoints: Math.round(avgPoints * 100) / 100,
        avgScore: Math.round(avgScore * 100) / 100,
      },
      topPerformers: await User.find({ role: 'ambassador' })
        .sort({ points: -1 })
        .limit(5)
        .select('name points score'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics,
};