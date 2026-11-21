const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    targetExam: { type: String, default: 'Azure AI-900 / Semester Finals' },
    studyStreak: { type: Number, default: 6 },
    totalStudyTimeHours: { type: Number, default: 47 },
    coursesCompleted: { type: Number, default: 8 },
    tokensRemaining: { type: Number, default: 14836 },
    tier: { type: String, default: 'PREMIUM' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
