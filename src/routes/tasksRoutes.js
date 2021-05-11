const { Router } = require('express')
const authMiddleware = require('../middlewares/auth')
const authAccess = require('../middlewares/userAccess')
const { imageOnlyUpload, UploadKey } = require('../configs/fileUpload')
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
router.delete(
  '/tasks/:id/messages',
  authMiddleware.authorization,
  authAccess.workerAndClientAccess,
  taskController.deleteMessage
)

router.post(
  '/tasks/:id/messages',
  authMiddleware.authorization,
  authAccess.workerAndClientAccess,
  taskController.postMessageToTask
)

router.post(
  '/tasks/:id/image',
  authMiddleware.authorization,
  authAccess.workerAccess,
  imageOnlyUpload.single(UploadKey.IMAGE_UPLOAD),
  taskController.postTaskImage
)

module.exports = router
