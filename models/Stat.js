const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const StatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },

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
    type: Number,
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
});

module.exports = mongoose.model('Stat', StatSchema, 'stats');
