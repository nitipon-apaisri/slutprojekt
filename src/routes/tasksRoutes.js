const { Router } = require('express')
const authMiddleware = require('../middlewares/auth')
const { imageOnlyUpload, UploadKey } = require('../configs/fileUpload')

const router = Router()

router.get(
  '/tasks/',
  authMiddleware.authorization,
  authMiddleware.workerAndClientAccess
)
router.post('/tasks', authMiddleware.authorization, authMiddleware.workerAccess)
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

router.post(
  '/tasks/:id/image',
  imageOnlyUpload.single(UploadKey.IMAGE_UPLOAD),
  (req, res, next) => {
    const { user } = req.user
    const { buffer } = req.file

    res.json({ message: 'success' })
  }
)

module.exports = router
