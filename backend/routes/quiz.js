const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const QuizResult = require('../models/QuizResult');
const QuizState = require('../models/QuizState');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

const MAX_RETRIES = 3;

const getTriviaBaseUrl = () => process.env.TRIVIA_API_BASE_URL || 'https://the-trivia-api.com/v2';

const fetchJson = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

const toSafeInteger = (value, fallback = 0) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.floor(parsed));
};


// Endpoint to fetch all quiz categories
router.get('/categories', async (req, res) => {
  let attempts = 0;
  while (attempts < MAX_RETRIES) {
    try {
      const data = await fetchJson(`${getTriviaBaseUrl()}/tags`);
      return res.json(data);
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
      const data = await fetchJson(`${getTriviaBaseUrl()}/questions?categories=${encodeURIComponent(category)}`);
      return res.json(data);
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed to fetch quizzes:`, error.message);
    }
  }
  res.status(500).json({ message: 'Failed to fetch quizzes after multiple attempts.' });
});

// Endpoint to create trivia sessions based on a subcategory
router.get('/create-sessions/:subcategory', async (req, res) => {
  const { subcategory } = req.params;

  let attempts = 0;
  while (attempts < MAX_RETRIES) {
    try {
      const questions = await fetchJson(`${getTriviaBaseUrl()}/questions?categories=${encodeURIComponent(subcategory)}&limit=30`);
      
      const sessions = [];
      // Break the fetched questions into sessions of 10
      for (let i = 0; i < questions.length; i += 10) {
        sessions.push({
          sessionId: `dummy-session-id-${Math.floor(i / 10)}`, // Aligning with dummy session logic from frontend
          questions: questions.slice(i, i + 10),
        });
      }

      // Format fallback if no questions were returned
      if (sessions.length === 0) {
        sessions.push({
          sessionId: 'dummy-session-id-0',
          questions: []
        });
      }

      return res.json(sessions);
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed to fetch sessions for subcategory ${subcategory}:`, error.message);
    }
  }
  res.status(500).json({ message: 'Failed to create quiz sessions after multiple attempts.' });
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
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$category', totalScore: { $sum: '$score' } } },
    ]);

    res.status(200).json(scores);
  } catch (err) {
    console.error('Failed to retrieve user scores:', err);
    res.status(500).json({ message: 'Failed to retrieve scores' });
  }
});

// Fetch completed quizzes. Supports optional pagination with ?page=1&limit=10.
router.get('/completed-quizzes', async (req, res) => {
  const { userId } = req.user;
  const page = Math.max(parseInt(req.query.page, 10) || 0, 0);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 0, 0), 50);

  try {
    const query = { userId };
    const baseQuery = QuizResult.find(query).sort({ date: -1 });

    if (!page || !limit) {
      const completedQuizzes = await baseQuery;
      return res.status(200).json(completedQuizzes);
    }

    const quizzes = await baseQuery.skip((page - 1) * limit).limit(limit);
    const totalQuizzes = await QuizResult.countDocuments(query);

    return res.status(200).json({
      quizzes,
      totalPages: Math.ceil(totalQuizzes / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error('Failed to fetch completed quizzes:', err);
    return res.status(500).json({ message: 'Failed to fetch completed quizzes' });
  }
});

// Save quiz result
router.post('/save-result', async (req, res) => {
  const { userId } = req.user;
  const { quizId, title, category, subcategory } = req.body;
  const total = toSafeInteger(req.body.total, 0);
  const submittedScore = toSafeInteger(req.body.score, 0);
  const score = Math.min(submittedScore, total);

  if (!quizId || !title || !category || !subcategory || total <= 0) {
    return res.status(400).json({ message: 'quizId, title, category, subcategory, and positive total are required' });
  }

  try {
    const existingResult = await QuizResult.findOne({ userId, quizId, category, subcategory });

    let pointDelta = score;
    let quizResult;

    if (existingResult) {
      pointDelta = score - existingResult.score;
      existingResult.title = title;
      existingResult.score = score;
      existingResult.total = total;
      existingResult.date = new Date();
      quizResult = await existingResult.save();
    } else {
      quizResult = await QuizResult.create({
        userId,
        quizId,
        title,
        category,
        subcategory,
        score,
        total,
      });
    }

    const user = await User.findById(userId);
    if (user) {
      user.points = Math.max(0, (user.points || 0) + pointDelta);
      await user.save();
    }

    return res.status(200).json(quizResult);
  } catch (err) {
    console.error('Failed to save quiz result:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Save quiz state
router.post('/save-state', async (req, res) => {
  const { userId } = req.user;
  const { quizId } = req.body;
  const questions = Array.isArray(req.body.questions) ? req.body.questions : [];
  const currentQuestionIndex = Math.min(toSafeInteger(req.body.currentQuestionIndex, 0), Math.max(questions.length - 1, 0));
  const timeRemaining = Math.min(toSafeInteger(req.body.timeRemaining, 30), 30);
  const maxScore = questions.length * 10;
  const scores = Math.min(toSafeInteger(req.body.scores, 0), maxScore);

  if (!quizId || questions.length === 0) {
    return res.status(400).json({ message: 'quizId and questions are required' });
  }

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
