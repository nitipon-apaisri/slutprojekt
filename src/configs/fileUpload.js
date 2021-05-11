const multer = require('multer')

const FileSize = {
  IMAGE: 1000 * 1000 * 4
}

const Validation = {
  IMAGE_EXT: /\.(png|jpg|jpeg)$/g
}

const UploadKey = {
  IMAGE_UPLOAD: 'imageUpload'
}

const imageOnlyUpload = multer({
  limits: {
    fileSize: FileSize.IMAGE
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(Validation.IMAGE_EXT)) {
      return cb(new Error('Wrong filename ext'))
    }
    cb(undefined, true)
  }
})

module.exports = {
  imageOnlyUpload,
  UploadKey
}
