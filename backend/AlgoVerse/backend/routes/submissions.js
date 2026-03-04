const express = require('express');
const router = express.Router();
const { runCode, submitSolution, getMySubmissions } = require('../controllers/submissionController');
const { protect } = require('../middleware/auth');

router.post('/run', protect, runCode);
router.post('/submit', protect, submitSolution);
router.get('/my-submissions', protect, getMySubmissions);

module.exports = router;
