const User = require('../models/User');
const Badge = require('../models/Badge');
const Submission = require('../models/Submission');

class GamificationService {
  async awardPoints(userId, points, reason) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.points += points;
    await user.save();

    // Check for badges
    await this.checkAndAwardBadges(user);

    return user;
  }

  async checkAndAwardBadges(user) {
    const badges = await Badge.find();

    for (const badge of badges) {
      if (!user.badges.includes(badge._id)) {
        const earned = await this.evaluateBadgeCriteria(user, badge);
        if (earned) {
          user.badges.push(badge._id);
          await user.save();
          // Could emit event or notification here
        }
      }
    }
  }

  async evaluateBadgeCriteria(user, badge) {
    // Simple criteria evaluation - can be expanded
    switch (badge.name) {
      case 'First Task':
        const submissions = await Submission.find({ userId: user._id, status: 'approved' });
        return submissions.length >= 1;
      case 'Task Master':
        const submissions2 = await Submission.find({ userId: user._id, status: 'approved' });
        return submissions2.length >= 10;
      case 'GitHub Star':
        return user.score >= 80;
      case 'Point Collector':
        return user.points >= 100;
      default:
        return false;
    }
  }

  async getLeaderboard(limit = 10) {
    const users = await User.find({ role: 'ambassador' })
      .sort({ points: -1, score: -1 })
      .limit(limit)
      .select('name points score badges')
      .populate('badges', 'name icon');

    return users.map((user, index) => ({
      rank: index + 1,
      ...user.toObject(),
    }));
  }

  async getUserStats(userId) {
    const user = await User.findById(userId).populate('badges', 'name description icon');
    if (!user) throw new Error('User not found');

    const submissions = await Submission.find({ userId }).populate('taskId', 'title points');
    const approvedSubmissions = submissions.filter(s => s.status === 'approved');
    const totalPointsFromTasks = approvedSubmissions.reduce((sum, s) => sum + s.taskId.points, 0);

    return {
      user: {
        name: user.name,
        points: user.points,
        score: user.score,
        badges: user.badges,
      },
      stats: {
        totalSubmissions: submissions.length,
        approvedSubmissions: approvedSubmissions.length,
        totalPointsFromTasks,
        githubScore: user.score,
      },
    };
  }
}

module.exports = new GamificationService();