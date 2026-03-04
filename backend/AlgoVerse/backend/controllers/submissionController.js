const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');
const codeExecutor = require('../services/codeExecutor');

exports.runCode = async (req, res) => {
    try {
        const { code, language, input } = req.body;
        const result = await codeExecutor.executeCode(code, language, input);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.submitSolution = async (req, res) => {
    try {
        const { problemId, code, language } = req.body;
        const userId = req.user.id;

        const problem = await Problem.findById(problemId);
        if (!problem) throw new Error('Problem not found');

        // Run test cases
        const testResults = await codeExecutor.runTestCases(code, language, problem.testCases);
        const passed = testResults.every(r => r.passed);
        const status = passed ? 'accepted' : 'wrong_answer';

        // Save submission
        const submission = await Submission.create({
            user: userId,
            problem: problemId,
            code,
            language,
            status,
            testCasesPassed: testResults.filter(r => r.passed).length,
            totalTestCases: problem.testCases.length,
            xpEarned: passed ? problem.xpReward : 0
        });


        // Update User Stats if Accepted
        if (passed) {
            await User.findByIdAndUpdate(userId, {
                $inc: {
                    'stats.totalProblems': 1,
                    'stats.acceptedSubmissions': 1,
                    xp: problem.xpReward
                },
                $addToSet: { solvedProblems: problemId }
            });

            // Update Topic Progress
            const Progress = require('../models/Progress');
            await Progress.findOneAndUpdate(
                { user: userId, topic: problem.topic },
                { $inc: { solvedProblems: 1 } },
                { upsert: true, new: true }
            );

            // Recalculate Mastery
            const totalInTopic = await Problem.countDocuments({ topic: problem.topic });
            const currentProgress = await Progress.findOne({ user: userId, topic: problem.topic });

            if (currentProgress) {
                currentProgress.totalProblems = totalInTopic;
                currentProgress.masteryLevel = Math.min(100, Math.round((currentProgress.solvedProblems / totalInTopic) * 100));
                await currentProgress.save();
            }

            // Real-time Leaderboard Update
            const io = req.app.get('io');
            if (io) {
                // Fetch updated user to send minimal info
                const updatedUser = await User.findById(userId).select('username xp level stats');
                io.emit('leaderboardUpdate', updatedUser);
            }
        }


        // Sanitize results for frontend
        const sanitizedResults = testResults.map((r, i) => {
            if (problem.testCases[i].isHidden) {
                return {
                    passed: r.passed,
                    isHidden: true,
                    input: 'Hidden',
                    expectedOutput: 'Hidden',
                    actualOutput: r.passed ? 'Hidden' : 'Hidden', // Don't leak actual output either
                    error: r.error // Error might be safe to show? Maybe mask if sensitive.
                };
            }
            return r;
        });

        res.json({ success: true, submission, testResults: sanitizedResults });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMySubmissions = async (req, res) => {
    try {
        const { problemId } = req.query;
        const query = { user: req.user.id };
        if (problemId) query.problem = problemId;

        const submissions = await Submission.find(query)
            .populate('problem', 'title difficulty')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: submissions.length, submissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
