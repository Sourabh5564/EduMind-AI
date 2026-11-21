const express = require('express');
const router = express.Router();
const { getFlashcards, createCard } = require('../controllers/flashcardsController');

router.get('/', getFlashcards);
router.post('/card', createCard);

module.exports = router;
