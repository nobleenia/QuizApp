const express = require('express');
const UserData = require('../models/UserData');
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware to verify token and extract userId
router.use(verifyToken);

// Save or update user data
router.post('/save', async (req, res) => {
  const { userId } = req.user;
  const { data, profileImage } = req.body;

  try {
    let userData = await UserData.findOne({ userId });
    if (userData) {
      userData.data = data;
      userData.profileImage = profileImage;
    } else {
      userData = new UserData({ userId, data, profileImage });
    }

    await userData.save();
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Retrieve user data
router.get('/load', async (req, res) => {
  const { userId } = req.user;

  try {
    const userData = await UserData.findOne({ userId }).populate(
      'userId',
      'username',
    );
    if (!userData) {
      return res.status(404).json({ message: 'No data found' });
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Retrieve Quiz Points
router.get('/user-data', async (req, res) => {
  const { userId } = req.user;

  try {
    const userData = await UserData.findOne({ userId });
    const quizResults = await QuizResult.find({ userId });

    let totalPoints = 0;
    quizResults.forEach((result) => {
      totalPoints += result.score;
    });

    let level = Math.floor(totalPoints / 1000);

    res.status(200).json({
      userId: userData.userId,
      username: userData.username,
      data: {
        ...userData.data,
        points: totalPoints,
        level: level,
      },
      profileImage: userData.profileImage,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
