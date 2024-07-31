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

module.exports = router;
