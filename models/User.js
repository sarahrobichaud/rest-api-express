const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter a username'],
    unique: true,
    trim: true,
    maxlength: [20, 'Username cannot be more than 20 caracters']
  },

  password: {
    type: String,
    required: [true, 'Please enter a password'],
    trim: true
  },
  slug: String,
  stats: {
    tokens: {
      type: Number,
      default: 50000,
      required: true
    },
    averageWinnings: {
      type: Number,
      default: 0,
      required: true
    },
    totalHands: {
      type: Number,
      default: 0,
      required: true
    },
    totalWon: {
      type: String,
      default: 0,
      required: true
    },
    lastGames: {
      type: [Object],
      default: [],
      required: true
    },
    awards: {
      type: [Object],
      default: [],
      required: true
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Users', UserSchema, 'users');
