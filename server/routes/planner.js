const express = require('express');
const router = express.Router();
const { getStudyPlan, createSession } = require('../controllers/plannerController');

router.get('/', getStudyPlan);
router.post('/', createSession);

module.exports = router;
