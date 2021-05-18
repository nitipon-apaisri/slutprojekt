const { Router } = require('express')
const authMiddleware = require('../middlewares/auth')
const authAccess = require('../middlewares/userAccess')
const userController = require('../controllers/userController')
const inputValidationMiddleware = require('../middlewares/inputValidation')
const router = Router()

router.get(
  '/users',
  authMiddleware.authorization,
  authAccess.workerAndAdminAccess,
  userController.listUsers
)
router.get(
  '/users/:id',
  authMiddleware.authorization,
  userController.getUserById
)
router.post(
  '/users',
  inputValidationMiddleware.validateUser,
  authMiddleware.authorization,
  authAccess.adminAccess,
  userController.createUser
)
router.patch(
  '/users/:id',
  inputValidationMiddleware.validateUser,
  authMiddleware.authorization,
  authAccess.adminAccess,
  userController.updateUser
)
router.delete(
  '/users/:id',
  authMiddleware.authorization,
  authAccess.adminAccess,
  userController.deleteUser
)

module.exports = router
