const express = require('express');
const axios = require('axios');
const router = express.Router();
const mongoose = require('mongoose');
const QuizResult = require('../models/QuizResult');
const QuizState = require('../models/QuizState');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

const MAX_RETRIES = 3;

// Endpoint to fetch all quiz categories
router.get('/categories', async (req, res) => {
  let attempts = 0;
  while (attempts < MAX_RETRIES) {
    try {
      const response = await axios.get('https://the-trivia-api.com/v2/tags');
      return res.json(response.data);
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed to fetch categories:`, error.message);
    }
  }
  res.status(500).json({ message: 'Failed to fetch quiz categories after multiple attempts.' });
});

// Endpoint to fetch quizzes by category
router.get('/quizzes/:category', async (req, res) => {
  const { category } = req.params;

  let attempts = 0;
  while (attempts < MAX_RETRIES) {
    try {
      const response = await axios.get(`https://the-trivia-api.com/v2/questions?categories=${category}`);
      return res.json(response.data);
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed to fetch quizzes:`, error.message);
    }
  }
  res.status(500).json({ message: 'Failed to fetch quizzes after multiple attempts.' });
});

// Admin route to create quizzes
router.post('/create', verifyToken, authorizeRole('admin'), async (req, res) => {
  const { title, questions } = req.body;

  try {
    const newQuiz = new Quiz({
      creator: req.user.userId,
      title,
      questions,
    });

    await newQuiz.save();
    res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
  } catch (err) {
    console.error('Error creating quiz:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch quizzes created by admins
router.get('/quizzes/admin', verifyToken, async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('creator', 'username');
    res.status(200).json(quizzes);
  } catch (err) {
    console.error('Error fetching admin-created quizzes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle quiz availability (admin-only)
router.patch('/toggle-availability/:quizId', verifyToken, authorizeRole('admin'), async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: quizId, creator: req.user.userId });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or not authorized to modify this quiz' });
    }

    quiz.isAvailable = !quiz.isAvailable; // Toggle availability
    await quiz.save();

    res.status(200).json({ message: `Quiz availability set to ${quiz.isAvailable}` });
  } catch (err) {
    console.error('Error toggling quiz availability:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch a specific quiz created by a specific admin
router.get('/fetch/:quizId', verifyToken, async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: quizId, creator: req.user.userId });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or not authorized to access this quiz' });
    }

    res.status(200).json(quiz);
  } catch (err) {
    console.error('Error fetching specific quiz:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all quizzes created by the logged-in admin
router.get('/admin-quizzes', verifyToken, authorizeRole('admin'), async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creator: req.user.userId });

    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'No quizzes found for this admin' });
    }

    res.status(200).json(quizzes);
  } catch (err) {
    console.error('Error fetching admin quizzes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all available quizzes
router.get('/available-quizzes', verifyToken, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isAvailable: true }).select('-questions'); // Exclude questions for performance

    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'No available quizzes found' });
    }

    res.status(200).json(quizzes);
  } catch (err) {
    console.error('Error fetching available quizzes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch a specific available quiz
router.get('/available-quizzes/:quizId', verifyToken, async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: quizId, isAvailable: true });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or not available' });
    }

    res.status(200).json(quiz);
  } catch (err) {
    console.error('Error fetching specific quiz:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch quizzes filtered by category or creator
router.get('/quizzes', async (req, res) => {
  const { category, creator } = req.query;

  try {
    let query = {};

    if (category) {
      query['questions.category'] = category;
    }

    if (creator) {
      query.creator = creator;
    }

    const quizzes = await Quiz.find(query);
    res.status(200).json(quizzes);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to verify token and extract userId
router.use(verifyToken);

// Aggregated User Scores by Category
router.get('/user-scores', async (req, res) => {
  const { userId } = req.user;

  try {
    const scores = await QuizResult.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$category', totalScore: { $sum: '$score' } } },
    ]);

    res.status(200).json(scores);
  } catch (err) {
    console.error('Failed to retrieve user scores:', err);
    res.status(500).json({ message: 'Failed to retrieve scores' });
  }
});

// Fetch Completed Quizzes with Pagination
router.get('/completed-quizzes', async (req, res) => {
  const { userId } = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const quizzes = await QuizResult.find({ userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: -1 });

    const totalQuizzes = await QuizResult.countDocuments({ userId });

    res.status(200).json({
      quizzes,
      totalPages: Math.ceil(totalQuizzes / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error('Failed to fetch completed quizzes:', err);
    res.status(500).json({ message: 'Failed to fetch completed quizzes' });
  }
});

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

    const user = await User.findById(userId);
    user.points = (user.points || 0) + score;
    await user.save();

    res.status(200).json(quizResult);
  } catch (err) {
    console.error('Failed to save quiz result:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save quiz state
router.post('/save-state', async (req, res) => {
  const { userId } = req.user;
  const { quizId, currentQuestionIndex, timeRemaining, scores, questions } = req.body;

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
    console.error('Failed to save quiz state:', err);
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
    console.error('Failed to retrieve quiz state:', err);
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
    console.error('Failed to retrieve completed quizzes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Retrieve completed sessions
router.get('/completed-sessions', async (req, res) => {
  const { userId } = req.user;

  try {
    const completedSessions = await QuizResult.find({ userId }).select('quizId -_id');
    res.status(200).json(completedSessions);
  } catch (err) {
    console.error('Failed to retrieve completed sessions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
