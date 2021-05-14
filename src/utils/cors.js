const {
  UnauthorizedError,
  ErrorMessage
} = require('../models/errors/unauthorized')

let corsOptions
if (process.env.NODE_ENV === 'dev') {
  corsOptions = { origin: '*' }
} else {
  const whitelist = process.env.CORS_WHITELIST.split(';')
  corsOptions = {
    origin: function (origin, callback) {
      console.log(origin)
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(
          new UnauthorizedError(ErrorMessage.FORBIDDEN_INVALID_SERVER_ACCESS)
        )
      }
    }
  }
}

module.exports = corsOptions
