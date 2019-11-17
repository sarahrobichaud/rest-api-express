const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc     Register user
// @route    POST /api/v1/auth/register
// @access   Public
exports.register = asyncHandler(async (req, res, next) => {
  let { username, password } = req.body;

  const user = await User.create({
    username,
    password
  });

  user.initNewUserStats();

  sendTokenResponse(user, 200, res);
});

// @desc     Login a user
// @route    POST /api/v1/auth/login
// @access   Public
exports.login = asyncHandler(async (req, res, next) => {
  let { username, password } = req.body;

  if (!username || !password) {
    return next(new ErrorResponse('Please provide credentials', 400));
  }

  //Check for user
  const user = await User.findOne({ username }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid email or password', 401));
  }

  //Verify password
  const passwordIsCorrect = await user.verifyPassword(password);
  if (!passwordIsCorrect) {
    return next(new ErrorResponse('Invalid email or password', 401));
  }

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

// @desc    Get currently logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
});
