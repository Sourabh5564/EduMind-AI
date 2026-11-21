const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  day: { type: String, required: true }, // Mon, Tue, etc.
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const StudyPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    weekStartDate: { type: Date, default: Date.now },
    sessions: [SessionSchema],
    weeklyGoalPercentage: { type: Number, default: 75 },
    subjectMasteryPercentage: { type: Number, default: 70 },
    timeSpentPercentage: { type: Number, default: 75 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyPlan', StudyPlanSchema);
