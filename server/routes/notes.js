const express = require('express');
const router = express.Router();
const { summarizeNotes, getNotes } = require('../controllers/notesController');

router.post('/summarize', (req, res, next) => {
  // Check if multer upload was attached in server.js
  const upload = req.app.locals.upload;
  if (upload) {
    upload.single('file')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      summarizeNotes(req, res, next);
    });
  } else {
    summarizeNotes(req, res, next);
  }
});

router.get('/', getNotes);

module.exports = router;
