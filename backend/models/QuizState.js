const mongoose = require('mongoose');

const QuizStateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quizId: {
    type: String,
    required: true,
  },
  currentQuestionIndex: {
    type: Number,
    required: true,
  },
  timeRemaining: {
    type: Number,
    required: true,
  },
  scores: {
    type: Number,
    required: true,
  },
  questions: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const QuizState = mongoose.model('QuizState', QuizStateSchema);

module.exports = QuizState;
