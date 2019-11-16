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

  res.status(201).json({ sucess: true, data: user });
});
