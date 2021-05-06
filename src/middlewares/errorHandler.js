const BaseError = require('../models/errors/base')
module.exports = (error, req, res, next) => {
  if (error instanceof BaseError) {
    return res.status(error.errorCode).json({ error: error.message })
  }

  if (process.env.NODE_ENV === 'dev') {
    return res.status(500).json({ error: error.message })
  }

  return res.status(500).json({
    error: 'Something went wrong, please contact an admin if the error persists'
  })
}
