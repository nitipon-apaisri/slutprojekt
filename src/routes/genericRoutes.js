const { Router } = require('express')
const authMiddleware = require('../middlewares/auth')
const userController = require('../controllers/userController')
const router = Router()

router.post('/auth', userController.signIn)
router.get('/users/:id', userController.getUserById)
router.get('/me', authMiddleware.authorization)

module.exports = router
