const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get a single user
// @route   GET /api/v1/users/:id
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
  let { username, password } = req.body;
  const user = await User.create({ username, password });

  res.status(201).json({
    success: true,
    message: 'Created a new user',
    data: user
  });
});

// @desc    Create a new user
// @route   PUT /api/v1/users/:id
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
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  //Handle non-existant id with correct format
  if (!user) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${err.value}`, 404)
    );
  }

  user.remove();
  res.status(200).json({
    success: true,
    message: `successfully deleted user ${req.params.id}`
  });
});

// @desc    Upload avatar
// @route   PUT /api/v1/users/:userId/avatar
// @access  Private
exports.uploadUserAvatar = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(
      new ErrorResponse(`No user with an id of ${req.params.userId}`, 404)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }
  const file = req.files.file;

  //Check if file is of type image
  if (!file.mimetype.startsWith('image/')) {
    return next(new ErrorResponse('Please upload an image', 400));
  }

  // Check file size
  if (!file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse('Please upload an image less than 1MB', 400));
  }

  // Create custom file name
  file.name = `avatar_${req.params.userId}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      return next(
        new ErrorResponse('Something went wrong with your file upload', 500)
      );
    }
    await User.findByIdAndUpdate(req.params.userId, { avatar: file.name });
  });
  res
    .status(200)
    .json({ success: true, message: 'Avatar uploaded', data: file.name });
});
