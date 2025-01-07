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
  console.log('Send friend request endpoint hit', req.user.userId);
  const { userId } = req.user; // Sender's ID
  const { recipientId } = req.body; // Receiver's ID

  try {
    console.log('Request Body:', req.body);
    console.log('Authenticated User ID:', req.user.userId);
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

    // Prevent adding a friend twice
    const alreadyFriends = sender.friends.includes(recipientId);
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
  const { userId } = req.user; // The receiver of the friend request
  const { requestId } = req.body; // The request ID to be accepted

  try {
    // Find the receiver and the friend request
    const receiver = await User.findById(userId);
    const friendRequest = receiver.friendRequests.id(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Add the sender to the receiver's friends list
    receiver.friends.push(friendRequest.from);

    // Remove the friend request from the receiver's list
    receiver.friendRequests = receiver.friendRequests.filter(
      (req) => req._id.toString() !== requestId,
    );

    await receiver.save();

    // Now, update the sender's friend list
    const sender = await User.findById(friendRequest.from);
    sender.friends.push(receiver._id);

    // Optionally, you can remove the request from the sender's side as well if you were storing it
    await sender.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error('Error accepting friend request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Decline Friend Request
router.post('/decline-friend-request', async (req, res) => {
  const { userId } = req.user; // The receiver of the friend request
  const { requestId } = req.body; // The request ID to be declined

  try {
    // Find the receiver and the friend request
    const receiver = await User.findById(userId);
    const friendRequest = receiver.friendRequests.id(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Remove the friend request from the receiver's list
    receiver.friendRequests = receiver.friendRequests.filter(
      (req) => req._id.toString() !== requestId,
    );

    await receiver.save();

    res.status(200).json({ message: 'Friend request declined' });
  } catch (err) {
    console.error('Error declining friend request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
