const { Router } = require('express')
const authMiddleware = require('../middlewares/auth')
const userController = require('../controllers/userController')
const router = Router()

router.get(
  '/users',
  authMiddleware.authorization,
  authMiddleware.workerAndAdminAccess,
  userController.listUsers
)
router.get(
  '/users/:id',
  authMiddleware.authorization,
  userController.getUserById
)
router.post(
  '/users',
  authMiddleware.authorization,
  authMiddleware.adminAccess,
  userController.createUser
)
router.patch(
  '/users/:id',
  authMiddleware.authorization,
  authMiddleware.adminAccess,
  userController.updateUser
)
router.delete(
  '/users/:id',
  authMiddleware.authorization,
  authMiddleware.adminAccess,
  userController.deleteUser
)

module.exports = router
