const router = require('express').Router({ mergeParams: true });
const { initStat, getStat, updateStat } = require('../controllers/stats');

const Stat = require('../models/Stat');
const advancedResults = require('../middleware/advancedResults');

const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(Stat, 'user'), getStat)
  .post(protect, initStat)
  .put(protect, updateStat);

module.exports = router;
