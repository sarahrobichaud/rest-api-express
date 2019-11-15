const router = require('express').Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserAvatar
} = require('../controllers/users');

//Include other resource routers
const statRouter = require('./stats');

// Re-routing
router.use('/:userId/stats', statRouter);

router.route('/:userId/avatar').put(uploadUserAvatar);

router
  .route('/')
  .get(getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
