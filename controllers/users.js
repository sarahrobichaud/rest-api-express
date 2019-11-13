// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
exports.getUsers = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Get all users' });
};

// @desc    Get a single user
// @route   GET /api/v1/users
// @access  Public
exports.getUser = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Get a single user' });
};

// @desc    Create a new user
// @route   POST /api/v1/users
// @access  Private
exports.createUser = (req, res, next) => {
  res.status(201).json({ success: true, message: 'Create new user' });
};

// @desc    Create a new user
// @route   PUT /api/v1/users
// @access  Private
exports.updateUser = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Update User' });
};

// @desc    Delete a user
// @route   DELETE /api/v1/users
// @access  Private
exports.deleteUser = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Delete User' });
};
