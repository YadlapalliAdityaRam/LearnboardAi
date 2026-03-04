const Problem = require('../models/Problem');
const mongoose = require('mongoose');

exports.getAllProblems = async (req, res) => {
    try {
        const { difficulty, topic, search } = req.query;
        const query = { isActive: true };

        if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
        if (topic && topic !== 'All') query.topic = topic;
        if (search) query.title = { $regex: search, $options: 'i' };

        const problems = await Problem.find(query).select('-testCases -solution');
        res.json({ success: true, problems });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProblem = async (req, res) => {
    try {
        const id = req.params.id;
        let query;

        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            query = { slug: id };
        }
        console.log(`Searching for problem with query:`, query);

        const problem = await Problem.findOne(query);

        if (!problem) {
            console.log("Problem not found for query:", query);
            return res.status(404).json({ success: false, message: 'Problem not found' });
        }

        // Sanitize test cases (hide inputs/outputs of hidden cases)
        const problemObj = problem.toObject();
        problemObj.testCases = problemObj.testCases.map(tc => {
            if (tc.isHidden) {
                return { _id: tc._id, isHidden: true, input: 'Hidden', output: 'Hidden' };
            }
            return tc;
        });

        res.json({ success: true, problem: problemObj });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createProblem = async (req, res) => {
    try {
        const problem = await Problem.create(req.body);
        res.status(201).json({ success: true, problem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
