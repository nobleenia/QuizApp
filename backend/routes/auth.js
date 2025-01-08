const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const redisClient = require('../redisClient');
const User = require('../models/User');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Password complexity validation
const passwordComplexity = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// Registration route
router.post(
  '/register',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('username', 'Username is required').notEmpty(),
  ],
  async (req, res) => {
    const { country, phone, email, username, password } = req.body;

    // Validate password complexity
    if (!passwordComplexity(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
      });
    }

    try {
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        const errorMessage =
          existingUser.email === email
            ? 'User with this email already exists'
            : 'User with this phone number already exists';
        return res.status(400).json({ message: errorMessage });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        country,
        phone,
        email,
        username,
        password: hashedPassword,
      });

      await user.save();

      const payload = { userId: user._id, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(201).json({ token });
    } catch (err) {
      console.error('Server error during registration:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update the user's status to 'online'
    user.status = 'online';
    await user.save();

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout User
router.post('/logout', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ code: 'USER_NOT_FOUND', message: 'User not found' });
    }

    // Update the user's status to 'offline'
    user.status = 'offline';
    await user.save();

    // Blacklist the token
    const token = req.header('x-auth-token');
    const tokenExpiry = Math.floor(new Date().getTime() / 1000) + 3600; // Token expiration in seconds
    redisClient.set(token, 'blacklisted', 'EX', tokenExpiry);

    // Emit user offline event using req.io
    if (req.io) {
      req.io.emit('userStatusUpdate', { userId: user._id, status: 'offline' });
    } else {
      console.warn('Socket.IO instance not available');
    }

    res.status(200).json({
      message: 'User logged out successfully',
      timestamp: new Date().toISOString(),
      userId: user._id,
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ code: 'SERVER_ERROR', message: 'Server error' });
  }
});

// Protected route to verify authentication
router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Access granted to protected route',
    user: req.user, // Send back the decoded user info (userId and role)
  });
});

// Fetch Users
router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find().select('username status profileImage');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send Friend Request
router.post('/send-friend-request', verifyToken, async (req, res) => {
  const { userId } = req.user; // Sender's ID
  const { recipientId } = req.body; // Receiver's ID

  try {
    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }

    const sender = await User.findById(userId);
    const receiver = await User.findById(recipientId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent duplicate friend requests
    const existingRequest = receiver.friendRequests.find(
      (request) => request.from.toString() === userId
    );
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Prevent sending requests to existing friends
    if (sender.friends.includes(recipientId)) {
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
router.post('/accept-friend-request', verifyToken, async (req, res) => {
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
      (req) => req._id.toString() !== requestId
    );

    await receiver.save();

    // Add the receiver to the sender's friends list
    const sender = await User.findById(friendRequest.from);
    sender.friends.push(receiver._id);
    await sender.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error('Error accepting friend request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject Friend Request
router.post('/decline-friend-request', verifyToken, async (req, res) => {
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
      (req) => req._id.toString() !== requestId
    );

    await receiver.save();

    res.status(200).json({ message: 'Friend request declined' });
  } catch (err) {
    console.error('Error declining friend request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin-Only Route
router.post('/admin-only', verifyToken, authorizeRole('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome, Admin! This is an admin-only route.' });
});

module.exports = router;
