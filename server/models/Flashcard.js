const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
  mastered: { type: Boolean, default: false },
  lastReviewed: { type: Date, default: Date.now },
});

const FlashcardDeckSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deckName: { type: String, required: true },
    subject: { type: String, default: 'General' },
    cards: [CardSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('FlashcardDeck', FlashcardDeckSchema);
