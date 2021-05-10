const { Router } = require('express')
const authMiddleware = require('../middlewares/auth')
const userController = require('../controllers/userController')
const router = Router()

router.get(
  '/users',
  authMiddleware.authorization,
  authMiddleware.workerAndAdminAccess,
  userController.signIn
)
router.post(
  '/users',
  authMiddleware.authorization,
  authMiddleware.adminAccess,
  userController.createUser
)

module.exports = router
