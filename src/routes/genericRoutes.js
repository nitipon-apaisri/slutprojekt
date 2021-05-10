const { Router } = require('express')
const authMiddleware = require('../middlewares/auth')
const userController = require('../controllers/userController')
const router = Router()

router.post('/auth', userController.signIn)
router.get('/me', authMiddleware.authorization, userController.getMe)

module.exports = router
