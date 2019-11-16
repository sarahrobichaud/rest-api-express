const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
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
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

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
