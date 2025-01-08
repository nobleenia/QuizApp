const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user', // Default role is 'user'
  },
  points: {
    type: Number,
    default: 0,
  },
  friendRequests: [
    {
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The sender of the friend request
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }, // Request status
    },
  ],
  friends: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The user's friends
  ],
  profileImage: {
    type: String,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  friendRequests: [
    {
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
