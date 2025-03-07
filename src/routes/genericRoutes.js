const { Router } = require('express')
const authMiddleware = require('../middlewares/auth')
const userController = require('../controllers/userController')
const inputValidationMiddleware = require('../middlewares/inputValidation')
const router = Router()

router.post('/auth', userController.signIn)
router.get('/me', authMiddleware.authorization, userController.getMe)
router.patch(
  '/me',
  authMiddleware.authorization,
  inputValidationMiddleware.validateUserMe,
  userController.updateMe
)

module.exports = router
