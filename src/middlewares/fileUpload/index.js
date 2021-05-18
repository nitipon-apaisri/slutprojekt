const multer = require('multer')
const {
  FileSize,
  Validation,
  UploadKey,
  imageStorage
} = require('./fileUpload.utils')

const fileUploadError = require('../../models/errors/fileUpload')
const { FileUploadError } = fileUploadError

const imageOnlyUpload = multer({
  limits: { fileSize: FileSize.IMAGE },
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(Validation.IMAGE_EXT)) {
      return cb(
        new FileUploadError(fileUploadError.ErrorMessage.WRONG_FILE_TYPE, 409)
      )
    }
    cb(undefined, true)
  }
})
module.exports = {
  imageOnlyUpload,
  UploadKey
}
