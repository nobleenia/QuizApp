const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserData = require('../models/UserData');

const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
  const { country, phone, email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(400)
          .json({ message: 'User with this email already exists' });
      } else if (existingUser.phone === phone) {
        return res
          .status(400)
          .json({ message: 'User with this phone number already exists' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hashed password during registration:', hashedPassword); // Debugging line

    const user = new User({
      country,
      phone,
      email,
      username,
      password: hashedPassword,
    });
    await user.save();

    const userData = new UserData({ userId: user._id });
    await userData.save();

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error('Server error during registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid credentials: user not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Password provided:', password);
    console.log('Hashed password in DB:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials: password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('Login successful, token generated');
    res.status(200).json({ token });
  } catch (err) {
    console.error('Server error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
