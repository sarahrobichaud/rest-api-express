const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Stat = require('../models/Stat');

// @desc    Get stats of a user.
// @route   GET /api/v1/users/:userId/stats
// @access  Public
exports.getStat = asyncHandler(async (req, res, next) => {
  // let query;
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(
      new ErrorResponse(`No user with an id of ${req.params.userId}`),
      404
    );
  }

  res.status(200).json(res.advancedResults);
});

// @desc    Update stats of a user.
// @route   PUT /api/v1/users/:userId/stats
// @access  Private
exports.updateStat = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId).populate('stats');
  if (!user) {
    return next(
      new ErrorResponse(`No user with an id of ${req.params.userId}`),
      404
    );
  }

  const stat = await Stat.findByIdAndUpdate(user.stats.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true,
    message: `Updated stats of user ${user._id}`,
    data: stat
  });
});
