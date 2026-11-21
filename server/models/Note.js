const mongoose = require('mongoose');

const NoteSummarySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    subject: { type: String, default: 'General' },
    originalFileName: { type: String, default: '' },
    originalText: { type: String, required: true },
    summary: { type: String, required: true },
    examSummary: [{ type: String }],
    keyConcepts: [
      {
        term: { type: String },
        definition: { type: String },
      },
    ],
    detailedNotes: [
      {
        title: { type: String },
        points: [{ type: String }],
      },
    ],
    flashcards: [
      {
        front: { type: String },
        back: { type: String },
      },
    ],
    questions: [
      {
        question: { type: String },
        type: { type: String },
        answer: { type: String },
      },
    ],
    quickStats: {
      keyConcepts: { type: Number, default: 0 },
      mainTopics: { type: Number, default: 0 },
      examRelevance: { type: String, default: 'High' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NoteSummary', NoteSummarySchema);
