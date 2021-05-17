const { Router } = require('express')
const authMiddleware = require('../middlewares/auth')
const authAccess = require('../middlewares/userAccess')
const { imageOnlyUpload, UploadKey } = require('../middlewares/fileUpload')
const taskController = require('../controllers/taskController')

const router = Router()

router.get(
  '/tasks',
  authMiddleware.authorization,
  authAccess.workerAndClientAccess,
  taskController.getTasks
)
router.post(
  '/tasks',
  authMiddleware.authorization,
  authAccess.workerAccess,
  taskController.postCreateTask
)
router.get(
  '/tasks/:id',
  authMiddleware.authorization,
  authAccess.workerAndClientAccess,
  taskController.getTaskById
)
router.patch(
  '/tasks/:id',
  authMiddleware.authorization,
  authAccess.workerAccess,
  taskController.patchUpdateTask
)
router.delete(
  '/tasks/:id',
  authMiddleware.authorization,
  authAccess.adminAccess,
  taskController.deleteTaskById
)
router.get(
  '/tasks/:id/messages',
  authMiddleware.authorization,
  authAccess.workerAndClientAccess,
  taskController.getAllMessagesFromTask
)
router.patch(
  '/tasks/:id/messages',
  authMiddleware.authorization,
  authAccess.workerAndClientAccess
)
router.post(
  '/tasks/:id/messages',
  authMiddleware.authorization,
  authAccess.workerAndClientAccess,
  taskController.postMessageToTask
)
router.delete(
  '/tasks/:id/messages/:msg_id',
  authMiddleware.authorization,
  authAccess.workerAndClientAccess,
  taskController.deleteMessage
)

router.post(
  '/tasks/:id/image',
  authMiddleware.authorization,
  authAccess.workerAccess,
  imageOnlyUpload.single(UploadKey.IMAGE_UPLOAD),
  taskController.postTaskImage
)

router.post(
  '/tasks/:id/error_reports',
  authMiddleware.authorization,
  authAccess.clientAccess,
  taskController.postReport
)

router.get(
  '/tasks/:id/error_reports',
  authMiddleware.authorization,
  authAccess.workerAndClientAccess,
  taskController.getReport
)

router.patch(
  '/tasks/:id/error_reports',
  authMiddleware.authorization,
  authAccess.workerAndClientAccess,
  taskController.updateReport
)

module.exports = router
