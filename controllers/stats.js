const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Stat = require('../models/Stat');

// @desc    Get stats of a user.
// @route   GET /api/v1/users/:userId/stats
// @access  Public
exports.getStat = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(
      new ErrorResponse(`No user with an id of ${req.params.userId}`),
      404
    );
  }
  const stat = await Stat.find({ user: user._id }).populate({
    path: 'user',
    select: 'username'
  });
  res.status(200).json(stat);
});

// @desc    Get stats of a user.
// @route   POST /api/v1/users/:userId/stats
// @access  Private
exports.initStat = asyncHandler(async (req, res, next) => {
  req.body.user = req.params.userId;
  console.log(req.params);

  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(
      new ErrorResponse(`No user with an id of ${req.params.userId}`),
      404
    );
  }

  const baseStats = {
    tokens: 150000,
    averageWinnings: 0,
    totalHands: 0,
    lastGames: [],
    awards: []
  };

  const stat = await Stat.create({
    user: req.body.user,
    ...baseStats
  });
  res.status(201).json(stat);
});

// @desc    Update stats of a user.
// @route   PUT /api/v1/users/:userId/stats
// @access  Private
exports.updateStat = asyncHandler(async (req, res, next) => {
  console.log(req.params.userId);
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
  res.status(200).json(stat);
});
