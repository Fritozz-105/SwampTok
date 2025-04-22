const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: String,
  photoURL: String,
  dateOfBirth: Date,
  bio: {
    type: String,
    default: ''
  },
  interests: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);
