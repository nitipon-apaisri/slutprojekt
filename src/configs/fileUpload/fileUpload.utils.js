const path = require('path')
const multer = require('multer')
const UploadKey = {
  IMAGE_UPLOAD: 'imageUpload'
}

const FileSize = {
  IMAGE: 1000 * 1000
}

const Validation = {
  IMAGE_EXT: /\.(png|jpg|jpeg)$/g
}

const Storage = {
  IMAGE: 'public/images',
  getFileExt: file => path.extname(file.originalname)
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, Storage.IMAGE)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + Storage.getFileExt(file))
  }
})

module.exports = {
  FileSize,
  Validation,
  UploadKey,
  imageStorage
}
