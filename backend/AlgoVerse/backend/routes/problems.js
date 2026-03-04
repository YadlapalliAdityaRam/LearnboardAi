const express = require('express');
const router = express.Router();
const { getAllProblems, getProblem, createProblem } = require('../controllers/problemController');
const { protect } = require('../middleware/auth');

router.get('/', getAllProblems);
router.get('/:id', getProblem);
router.post('/', protect, createProblem); // Admin only in real app

module.exports = router;
