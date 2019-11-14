const router = require('express').Router({ mergeParams: true });
const { initStat, getStat, updateStat } = require('../controllers/stats');

router
  .route('/')
  .get(getStat)
  .post(initStat)
  .put(updateStat);

module.exports = router;
