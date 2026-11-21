const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');

router.get('/', getAnalytics);
router.get('/progress', getAnalytics);

module.exports = router;
