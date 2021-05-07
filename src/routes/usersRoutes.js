const { Router } = require('express')
const authMiddleware = require('../middlewares/auth')

const router = Router()

router.get(
  '/users',
  authMiddleware.authorization,
  authMiddleware.workerAndAdminAccess
)
router.post('/users', authMiddleware.authorization, authMiddleware.adminAccess)

module.exports = router
