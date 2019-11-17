const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Stat = require('./Stat');
const colors = require('colors');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Please enter an email address'],
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email address'
      ]
    },
    username: {
      type: String,
      required: [true, 'Please enter a username'],
      trim: true,
      unique: true,
      uniqueCaseInsensitive: true,
      maxlength: [20, 'Username cannot be more than 20 caracters']
    },

    password: {
      type: String,
      required: [true, 'Please enter a password'],
      select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    role: {
      type: String,
      default: 'user'
    },
    slug: String,

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Reverse populate
UserSchema.virtual('stats', {
  ref: 'Stat',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

//Create user slug from username
UserSchema.pre('save', function(next) {
  this.slug = slugify(this.username, { lower: true });
  next();
});

//Encrypt password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Verify password
UserSchema.methods.verifyPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// Get jwt token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

UserSchema.methods.getResetPasswordToken = function() {
  //Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  //Hash and set
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //Set token expiration
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

//Initialize stats
UserSchema.methods.initNewUserStats = async function() {
  console.log(
    `Initializing stats for user ${this._id} (${this.username})`.yellow
  );
  // Base stats
  const baseStats = {
    tokens: 150000,
    averageWinnings: 0,
    totalHands: 0,
    lastGames: [],
    awards: []
  };
  // Create a document with the initial stats and
  // the userId attached to it.
  await Stat.create({
    user: this._id,
    ...baseStats
  });
  console.log(`Done initializing stats for user ${this._id}`.green);
};

//Delete user stats on deletion of user.
UserSchema.pre('remove', async function(next) {
  console.log('Deleted stats');
  await this.model('Stat').deleteMany({ user: this._id });
  next();
});

UserSchema.plugin(uniqueValidator, {
  message: 'Username already in use'
});

module.exports = mongoose.model('User', UserSchema, 'users');
