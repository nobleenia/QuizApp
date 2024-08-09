const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  points: {
    type: Number,
    default: 0,
  },
  profileImage: {
    type: String,
    default: '/public/userImage.jpg', // Default profile image path
  },
  status: {
    type: String,
    default: 'offline',
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  friendRequests: [
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This is crucial for population to work
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
      },
    },
  ],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
