const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads directory exists or fallback to os.tmpdir()
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (err) {
    console.warn('Could not create uploads directory, fallback to temp:', err.message);
  }
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = fs.existsSync(uploadsDir) ? uploadsDir : require('os').tmpdir();
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/plain', 'image/png', 'image/jpeg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
});

// Make upload middleware available
app.locals.upload = upload;

// MongoDB Connection with graceful fallback
const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
      console.log('MongoDB connected successfully');
    } else {
      console.log('MONGO_URI not set - running server with in-memory mock store');
    }
  } catch (error) {
    console.warn('⚠️ MongoDB connection warning (local DB not running):', error.message);
    console.log('ℹ️ Server will continue running with mock API responses for local testing');
  }
};

connectDB();

// Route stubs
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/flashcards', require('./routes/flashcards'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/planner', require('./routes/planner'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EduMind AI Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`EduMind AI Server running on port ${PORT} (0.0.0.0 & ::)`);
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
