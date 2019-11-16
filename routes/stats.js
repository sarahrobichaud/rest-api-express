const router = require('express').Router({ mergeParams: true });
const { initStat, getStat, updateStat } = require('../controllers/stats');

const Stat = require('../models/Stat');
const advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(advancedResults(Stat, 'user'), getStat)
  .post(initStat)
  .put(updateStat);

module.exports = router;

// Was working on advancedResults middleware
