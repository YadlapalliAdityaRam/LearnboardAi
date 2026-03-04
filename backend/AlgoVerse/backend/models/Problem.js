const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true },
    isHidden: { type: Boolean, default: false }
});

const ProblemSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    topic: { type: String, required: true },
    tags: [String],
    companies: [String],
    constraints: String,
    hints: [String],
    examples: [{
        input: String,
        output: String,
        explanation: String
    }],
    testCases: [TestCaseSchema],
    starterCode: {
        javascript: String,
        python: String,
        java: String,
        cpp: String,
        c: String
    },
    xpReward: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});

ProblemSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    next();
});

module.exports = mongoose.model('Problem', ProblemSchema);
