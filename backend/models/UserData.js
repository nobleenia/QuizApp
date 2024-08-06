const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  data: {
    type: Map,
    of: String,
  },
  profileImage: {
    type: String, // Assuming we are storing the image as a base64 string
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const UserData = mongoose.model('UserData', UserDataSchema);

module.exports = UserData;
