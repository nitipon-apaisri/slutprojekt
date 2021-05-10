const { Router } = require('express')
const authMiddleware = require('../middlewares/auth')
const taskController = require('../controllers/taskController')

const router = Router()

router.get(
  '/tasks',
  authMiddleware.authorization,
  authMiddleware.workerAndClientAccess,
  taskController.getTasks
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
  authMiddleware.workerAndClientAccess,
  taskController.getTaskById
)
router.patch(
  '/tasks/:id',
  authMiddleware.authorization,
  authMiddleware.workerAccess,
  taskController.patchUpdateTask
)
router.delete(
  '/tasks/:id',
  authMiddleware.authorization,
  authMiddleware.adminAccess,
  taskController.deleteTaskById
)
router.get(
  '/tasks/:id/messages',
  authMiddleware.authorization,
  authMiddleware.workerAndClientAccess,
  taskController.getAllMessagesFromTask
)
router.patch(
  '/tasks/:id/messages',
  authMiddleware.authorization,
  authMiddleware.workerAndClientAccess
)
router.delete(
  '/tasks/:id/messages',
  authMiddleware.authorization,
  authMiddleware.workerAndClientAccess,
  taskController.deleteMessage
)

router.post(
  '/tasks/:id/messages',
  authMiddleware.authorization,
  authMiddleware.workerAndClientAccess,
  taskController.postMessageToTask
)

module.exports = router
