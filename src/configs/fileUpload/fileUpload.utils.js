const UploadKey = {
  IMAGE_UPLOAD: 'imageUpload'
}

const FileSize = {
  IMAGE: 1000 * 1000
}

const Validation = {
  IMAGE_EXT: /\.(png|jpg|jpeg)$/g
}

module.exports = {
  FileSize,
  Validation,
  UploadKey
}
