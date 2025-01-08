const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const QuizSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  questions: [QuestionSchema],
  isAvailable: { type: Boolean, default: false }, // New field to track availability
  createdAt: { type: Date, default: Date.now },
});

const Quiz = mongoose.model('Quiz', QuizSchema);
module.exports = Quiz;
