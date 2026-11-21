const express = require('express');
const router = express.Router();
const { generateQuiz, getQuizzes } = require('../controllers/quizController');

router.post('/generate', generateQuiz);
router.get('/', getQuizzes);

module.exports = router;
