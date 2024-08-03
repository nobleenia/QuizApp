const express = require('express');
const axios = require('axios');
const router = express.Router();

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

module.exports = router;
