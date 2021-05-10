const { Router } = require('express')
const authMiddleware = require('../middlewares/auth')
const { imageOnlyUpload, UploadKey } = require('../configs/fileUpload')
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

router.post(
  '/tasks/:id/image',
  authMiddleware.authorization,
  imageOnlyUpload.single(UploadKey.IMAGE_UPLOAD),
  (req, res, next) => {
    const { id } = req.params
    const { buffer } = req.file

    const task = taskModel.findByIdAndUpdate(id, {
      $set: { image: Buffer.from(buffer) }
    })
    console.log(task)
    res.json({ message: 'success', task })
  }
)

module.exports = router
