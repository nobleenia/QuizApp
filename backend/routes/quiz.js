const express = require('express');
const axios = require('axios');
const router = express.Router();
const QuizResult = require('../models/QuizResult');
const QuizState = require('../models/QuizState');
const { verifyToken } = require('../middleware/authMiddleware');

// Endpoint to fetch all quiz categories
router.get('/categories', async (req, res) => {
  try {
    const response = await axios.get('https://the-trivia-api.com/v2/tags');
    const categories = response.data;
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch quiz categories' });
  }
});

// Endpoint to fetch quizzes by category
router.get('/quizzes/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const response = await axios.get(
      `https://the-trivia-api.com/v2/questions?categories=${category}`,
    );
    const quizzes = response.data;
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch quizzes for category' });
  }
});

// Endpoint to create multiple sessions and fetch questions
router.get('/create-sessions/:subcategory', async (req, res) => {
  const { subcategory } = req.params;
  const sessions = [];
  try {
    for (let i = 0; i < 10; i++) {
      const response = await axios.get(
        `https://the-trivia-api.com/v2/questions?tags=${subcategory}&limit=10`,
      );
      const questions = response.data;
      const sessionId = `dummy-session-id-${i + 1}`; // Generate unique session IDs
      sessions.push({ sessionId, questions });
    }
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Failed to create sessions or fetch questions' });
  }
});

// Middleware to verify token and extract userId
router.use(verifyToken);

// Save quiz result
router.post('/save-result', async (req, res) => {
  const { userId } = req.user;
  const { quizId, title, category, subcategory, score, total } = req.body;

  try {
    const quizResult = new QuizResult({
      userId,
      quizId,
      title,
      category,
      subcategory,
      score,
      total,
    });

    await quizResult.save();
    res.status(200).json(quizResult);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save quiz state
router.post('/save-state', async (req, res) => {
  const { userId } = req.user;
  const { quizId, currentQuestionIndex, timeRemaining, scores, questions } =
    req.body;

  try {
    let quizState = await QuizState.findOne({ userId, quizId });
    if (quizState) {
      quizState.currentQuestionIndex = currentQuestionIndex;
      quizState.timeRemaining = timeRemaining;
      quizState.scores = scores;
      quizState.questions = questions;
    } else {
      quizState = new QuizState({
        userId,
        quizId,
        currentQuestionIndex,
        timeRemaining,
        scores,
        questions,
      });
    }

    await quizState.save();
    res.status(200).json(quizState);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Retrieve quiz state
router.get('/load-state/:quizId', async (req, res) => {
  const { userId } = req.user;
  const { quizId } = req.params;

  try {
    const quizState = await QuizState.findOne({ userId, quizId });
    if (!quizState) {
      return res.status(404).json({ message: 'No state found' });
    }

    res.status(200).json(quizState);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Retrieve completed quizzes
router.get('/completed-quizzes', async (req, res) => {
  const { userId } = req.user;

  try {
    const completedQuizzes = await QuizResult.find({ userId });
    res.status(200).json(completedQuizzes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to retrieve completed sessions for a specific user
router.get('/completed-sessions', async (req, res) => {
  const { userId } = req.user;

  try {
    const completedSessions = await QuizResult.find({ userId }).select(
      'quizId -_id',
    );
    res.status(200).json(completedSessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
