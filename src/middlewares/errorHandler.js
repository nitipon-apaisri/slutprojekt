const { MulterError } = require('multer')
const BaseError = require('../models/errors/base')
module.exports = (error, req, res, next) => {
  if (error instanceof BaseError) {
    return res.status(error.errorCode).json({ error: error.message })
  }

  if (error instanceof MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res
          .status(409)
          .json({ error: 'file size to large for file provided' })
    }
  }

  if (process.env.NODE_ENV === 'dev') {
    return res.status(500).json({ error: error.message })
  }

  return res.status(500).json({
    error: 'Something went wrong, please contact an admin if the error persists'
  })
}
