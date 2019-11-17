const router = require('express').Router({ mergeParams: true });
const { getStat, updateStat } = require('../controllers/stats');

const Stat = require('../models/Stat');
const advancedResults = require('../middleware/advancedResults');

const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(Stat, 'user'), getStat)
  .put(protect, updateStat);

module.exports = router;
