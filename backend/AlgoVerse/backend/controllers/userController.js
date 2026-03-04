const User = require('../models/User');
const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission'); exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.find()
            .select('username level xp stats')
            .sort({ xp: -1 })
            .limit(10);

        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Heatmap Data (Last 365 days)
        const oneYearAgo = new Date();
        oneYearAgo.setDate(oneYearAgo.getDate() - 365);

        const heatmapData = await Submission.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), createdAt: { $gte: oneYearAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            }
        ]);

        // 2. Topic Breakdown (from Solved Problems)
        // Find user to get solvedProblems IDs
        const user = await User.findById(userId).populate('solvedProblems', 'tags difficulty');

        const topicStats = {};
        const difficultyStats = { Easy: 0, Medium: 0, Hard: 0 };

        if (user.solvedProblems) {
            user.solvedProblems.forEach(problem => {
                // Difficulty
                if (problem.difficulty) {
                    difficultyStats[problem.difficulty] = (difficultyStats[problem.difficulty] || 0) + 1;
                }

                // Tags
                if (problem.tags && problem.tags.length > 0) {
                    problem.tags.forEach(tag => {
                        topicStats[tag] = (topicStats[tag] || 0) + 1;
                    });
                }
            });
        }

        res.json({
            success: true,
            heatmap: heatmapData,
            topics: topicStats,
            difficulties: difficultyStats
        });
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
