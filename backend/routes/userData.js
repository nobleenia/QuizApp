const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UserData = require('../models/UserData');
const QuizResult = require('../models/QuizResult');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

const passwordComplexity = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

const normalizeObjectId = (value) => value?.toString?.() || String(value);

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
router.get('/load', verifyToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId)
      .populate('friendRequests.from', 'username profileImage') // Populate the `from` field in friendRequests
      .populate('friends', 'username profileImage');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      userId: user._id,
      username: user.username,
      profileImage: user.profileImage,
      points: user.points,
      level: Math.floor(user.points / 1000),
      achievements: [], // Assuming you're handling achievements separately
      friends: user.friends,
      friendRequests: user.friendRequests,
    });
  } catch (err) {
    console.error('Error loading user data:', err);
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
      userId,
      username: userData?.username || '',
      data: {
        ...(userData?.data ? Object.fromEntries(userData.data) : {}),
        points: totalPoints,
        level,
      },
      profileImage: userData?.profileImage || '',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to change password
router.post('/change-password', async (req, res) => {
  const { userId } = req.user;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required' });
  }

  if (!passwordComplexity(newPassword)) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Server error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to change username
router.post('/change-username', async (req, res) => {
  const { userId } = req.user;
  const newUsername = String(req.body.newUsername || '').trim();

  if (!/^[A-Za-z0-9_]{3,30}$/.test(newUsername)) {
    return res.status(400).json({
      message: 'Username must be 3–30 characters and contain only letters, numbers, and underscores.',
    });
  }

  try {
    const existing = await User.findOne({ username: newUsername, _id: { $ne: userId } });
    if (existing) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = newUsername;
    await user.save();

    res.status(200).json({ message: 'Username updated successfully' });
  } catch (err) {
    console.error('Error changing username:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to update profile image
router.post('/profile-image', async (req, res) => {
  const { userId } = req.user;
  const { profileImage } = req.body;

  try {
    // Update the User model
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profileImage = profileImage;
    await user.save();

    res.status(200).json({ message: 'Profile image updated successfully' });
  } catch (err) {
    console.error('Server error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to retrieve users
router.get('/users', verifyToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId).populate(
      'friends friendRequests.from',
    );

    // Exclude friends and pending requests from the user list
    const excludedUserIds = [
      userId,
      ...user.friends.map((friend) => friend._id),
      ...user.friendRequests.map((request) => request.from._id),
    ];

    const users = await User.find({ _id: { $nin: excludedUserIds } }).select(
      'username profileImage status',
    );
    res.status(200).json(users);
  } catch (err) {
    console.error('Error retrieving users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add the friend request to the receiver's friendRequests array
router.post('/send-friend-request', verifyToken, async (req, res) => {
  const { userId } = req.user; // Sender's ID
  const { recipientId } = req.body; // Receiver's ID

  try {
    const sender = await User.findById(userId);
    const receiver = await User.findById(recipientId);

    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent sending duplicate requests
    const existingRequest = receiver.friendRequests.find(
      (request) => request.from.toString() === userId,
    );
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    if (normalizeObjectId(userId) === normalizeObjectId(recipientId)) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
    }

    // Prevent adding a friend twice
    const alreadyFriends = sender.friends.some((friend) => normalizeObjectId(friend) === normalizeObjectId(recipientId));
    if (alreadyFriends) {
      return res.status(400).json({ message: 'You are already friends' });
    }

    // Add the friend request to the receiver's friendRequests
    receiver.friendRequests.push({ from: sender._id });
    await receiver.save();

    res.status(200).json({ message: 'Friend request sent' });
  } catch (err) {
    console.error('Error sending friend request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept Friend Request
router.post('/accept-friend-request', async (req, res) => {
  const { userId } = req.user;
  const { requestId } = req.body;

  try {
    const receiver = await User.findById(userId);
    if (!receiver) return res.status(404).json({ message: 'User not found' });

    const friendRequest = receiver.friendRequests.id(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    const sender = await User.findById(friendRequest.from);
    if (!sender) return res.status(404).json({ message: 'Sender not found' });

    if (!receiver.friends.some((friend) => normalizeObjectId(friend) === normalizeObjectId(sender._id))) {
      receiver.friends.push(sender._id);
    }

    if (!sender.friends.some((friend) => normalizeObjectId(friend) === normalizeObjectId(receiver._id))) {
      sender.friends.push(receiver._id);
    }

    receiver.friendRequests = receiver.friendRequests.filter(
      (request) => normalizeObjectId(request._id) !== normalizeObjectId(requestId),
    );

    await receiver.save();
    await sender.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error('Error accepting friend request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Decline Friend Request
router.post('/decline-friend-request', async (req, res) => {
  const { userId } = req.user;
  const { requestId } = req.body;

  try {
    const receiver = await User.findById(userId);
    if (!receiver) return res.status(404).json({ message: 'User not found' });

    const friendRequest = receiver.friendRequests.id(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    receiver.friendRequests = receiver.friendRequests.filter(
      (request) => normalizeObjectId(request._id) !== normalizeObjectId(requestId),
    );

    await receiver.save();

    res.status(200).json({ message: 'Friend request declined' });
  } catch (err) {
    console.error('Error declining friend request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
