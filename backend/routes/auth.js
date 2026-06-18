const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { blacklistToken } = require('../redisClient');
const User = require('../models/User');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

const passwordComplexity = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

const signToken = (user) => jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
);

router.post(
  '/register',
  [
    check('country', 'Country is required').notEmpty(),
    check('phone', 'Phone number is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 8 or more characters').isLength({ min: 8 }),
    check('username', 'Username is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { country, phone, email, username, password } = req.body;

    if (!passwordComplexity(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }

    try {
      const existingUser = await User.findOne({
        $or: [
          { email: email.toLowerCase() },
          { phone },
          { username },
        ],
      });

      if (existingUser) {
        let field = 'account';
        if (existingUser.email === email.toLowerCase()) field = 'email';
        if (existingUser.phone === phone) field = 'phone number';
        if (existingUser.username === username) field = 'username';
        return res.status(400).json({ message: `User with this ${field} already exists` });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        country,
        phone,
        email: email.toLowerCase(),
        username,
        password: hashedPassword,
      });

      await user.save();

      res.status(201).json({ token: signToken(user) });
    } catch (err) {
      console.error('Server error during registration:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },
);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    user.status = 'online';
    await user.save();

    res.status(200).json({ token: signToken(user), role: user.role, username: user.username });
  } catch (err) {
    console.error('Server error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ code: 'USER_NOT_FOUND', message: 'User not found' });
    }

    user.status = 'offline';
    await user.save();

    const token = req.header('x-auth-token') || req.header('authorization')?.replace(/^Bearer\s+/i, '');
    await blacklistToken(token, 60 * 60);

    if (req.io) {
      req.io.emit('userStatusUpdate', { userId: user._id, status: 'offline' });
    }

    res.status(200).json({
      message: 'User logged out successfully',
      timestamp: new Date().toISOString(),
      userId: user._id,
    });
  } catch (err) {
    console.error('Server error during logout:', err);
    res.status(500).json({ code: 'SERVER_ERROR', message: 'Server error' });
  }
});

router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Access granted to protected route',
    user: req.user,
  });
});

router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find().select('username status profileImage');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/send-friend-request', verifyToken, async (req, res) => {
  const { userId } = req.user;
  const { recipientId } = req.body;

  try {
    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }

    const sender = await User.findById(userId);
    const receiver = await User.findById(recipientId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingRequest = receiver.friendRequests.find(
      (request) => request.from.toString() === userId,
    );
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    if (sender.friends.some((friend) => friend.toString() === recipientId)) {
      return res.status(400).json({ message: 'You are already friends' });
    }

    receiver.friendRequests.push({ from: sender._id });
    await receiver.save();

    res.status(200).json({ message: 'Friend request sent' });
  } catch (err) {
    console.error('Error sending friend request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/accept-friend-request', verifyToken, async (req, res) => {
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

    if (!receiver.friends.some((friend) => friend.toString() === sender._id.toString())) {
      receiver.friends.push(sender._id);
    }
    if (!sender.friends.some((friend) => friend.toString() === receiver._id.toString())) {
      sender.friends.push(receiver._id);
    }

    receiver.friendRequests = receiver.friendRequests.filter(
      (request) => request._id.toString() !== requestId,
    );

    await receiver.save();
    await sender.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error('Error accepting friend request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/decline-friend-request', verifyToken, async (req, res) => {
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
      (request) => request._id.toString() !== requestId,
    );

    await receiver.save();

    res.status(200).json({ message: 'Friend request declined' });
  } catch (err) {
    console.error('Error declining friend request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/admin-only', verifyToken, authorizeRole('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome, Admin! This is an admin-only route.' });
});

module.exports = router;
