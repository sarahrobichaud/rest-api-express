const router = require('express').Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserAvatar
} = require('../controllers/users');

const User = require('../models/User');
const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

//Include other resource routers
const statRouter = require('./stats');

// Re-routing
router.use('/:userId/stats', statRouter);

router.route('/:userId/avatar').put(uploadUserAvatar);

router
  .route('/')
  .get(advancedResults(User, 'stats'), getUsers)
  .post(protect, authorize('admin'), createUser);

router
  .route('/:id')
  .get(getUser)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
