const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const errorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers['x-auth'] && req.headers['x-auth'].startsWith('Bearer')) {
    token = req.headers['x-auth'].split(' ')[1];
  }
  //   else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  // Make sure token exists
  console.log('TOKEN', token);
  if (!token) {
    next(new errorResponse('Not authorized', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    next(new errorResponse('Not authorized', 401));
  }
});
