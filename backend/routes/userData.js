const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UserData = require('../models/UserData');
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

// Endpoint to change password
router.post('/change-password', async (req, res) => {
  const { userId } = req.user;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      console.log('Incorrect current password');
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Ensure the new password is hashed correctly
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    console.log('Password hashed during change:', hashedPassword); // Debugging line
    await user.save();
    console.log('Password updated successfully');

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Server error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to change username
router.post('/change-username', async (req, res) => {
  const { userId } = req.user;
  const { newUsername } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = newUsername;
    await user.save();

    res.status(200).json({ message: 'Username updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to update profile image
router.post('/profile-image', async (req, res) => {
  const { userId } = req.user;
  const { profileImage } = req.body;

  try {
    const userData = await UserData.findOne({ userId });
    if (!userData) {
      return res.status(404).json({ message: 'User data not found' });
    }

    userData.profileImage = profileImage;
    await userData.save();

    res.status(200).json({ message: 'Profile image updated successfully' });
  } catch (err) {
    console.error('Server error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
