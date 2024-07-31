const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_BASE_URL =
  process.env.API_BASE_URL || 'https://the-trivia-api.com/api/v2';
const API_KEY = process.env.API_KEY;

app.use(express.json());

// Proxy route for fetching categories
app.get('/api/categories', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`, {
      headers: {
        // Authorization: `Bearer ${API_KEY}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send('Server error');
  }
});

// Proxy route for fetching quizzes
app.get('/api/quizzes', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/questions`, {
      headers: {
        // Authorization: `Bearer ${API_KEY}`,
      },
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).send('Server error');
  }
});

// Additional proxy routes...

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
