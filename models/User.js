const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  inventory: {
    tokens: {
      type: Number,
      default: 10000,
      required: true
    },

    award: {
      type: Array
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Users', UserSchema, 'users');
