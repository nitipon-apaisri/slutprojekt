const BaseError = require('./base')
const ErrorMessage = {
  FILE_TO_LARGE: 'file is to large',
  WRONG_FILE_TYPE: 'wrong filetype provided'
}

class FileUploadError extends BaseError {
  constructor(message, errorCode) {
    super(message, errorCode)
  }
}

module.exports = {
  FileUploadError,
  ErrorMessage
}
