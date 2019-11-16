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

  const token = user.getSignedJwtToken();

  res.status(201).json({ sucess: true, token, data: user });
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
  const token = user.getSignedJwtToken();
  res.status(201).json({ sucess: true, token });
});
