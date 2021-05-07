const { Router } = require('express')
const authMiddleware = require('../middlewares/auth')
const taskController = require('../controllers/taskController')

const router = Router()

router.get(
  '/tasks/',
  authMiddleware.authorization,
  authMiddleware.workerAndClientAccess
)
router.post(
  '/tasks',
  authMiddleware.authorization,
  authMiddleware.workerAccess,
  taskController.postCreateTask
)
router.get(
  '/tasks/:id',
  authMiddleware.authorization,
  authMiddleware.workerAndClientAccess
)
router.patch(
  '/tasks/:id',
  authMiddleware.authorization,
  authMiddleware.workerAccess
)
router.delete(
  '/tasks/:id',
  authMiddleware.authorization,
  authMiddleware.adminAccess
)
router.get(
  '/tasks/:id/messages',
  authMiddleware.authorization,
  authMiddleware.workerAndClientAccess
)
router.patch(
  '/tasks/:id/messages',
  authMiddleware.authorization,
  authMiddleware.workerAndClientAccess
)
router.delete(
  '/tasks/:id/messages',
  authMiddleware.authorization,
  authMiddleware.workerAndClientAccess
)

router.post(
  '/tasks/:id/messages',
  authMiddleware.authorization,
  authMiddleware.workerAccess
)

module.exports = router
