const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    message: 'All users',
    count: users.length,
    data: users
  });
});

// @desc    Get a single user
// @route   GET /api/v1/users
// @access  Public
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  //Handle non-existant id with correct format
  if (!user) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${err.value}`, 404)
    );
  }
  res
    .status(200)
    .json({ success: true, message: `User ${req.params.id}`, data: user });
});

// @desc    Create a new user
// @route   POST /api/v1/users
// @access  Private
exports.createUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Created a new user',
      data: user
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Create a new user
// @route   PUT /api/v1/users
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  //Handle non-existant id with correct format
  if (!user) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${err.value}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    message: `Updated user ${req.params.id}`,
    data: user
  });
});

// @desc    Delete a user
// @route   DELETE /api/v1/users
// @access  Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    //Handle non-existant id with correct format
    if (!user) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${err.value}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      message: `successfully deleted user ${req.params.id}`
    });
  } catch (err) {
    next(err);
  }
});
