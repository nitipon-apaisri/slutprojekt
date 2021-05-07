const { Router } = require('express')
const authMiddleware = require('../middlewares/auth')

const router = Router()

router.post('/auth')
router.get('/me', authMiddleware.authorization)

module.exports = router
