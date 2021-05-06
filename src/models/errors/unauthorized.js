const BaseError = require('./base')

const ErrorMessage = {
  FORBIDDEN: 'unauthorized action please login',
  FORBIDDEN_INVALID_TOKEN: 'unauthorized, invalid token',
  FORBIDDEN_INVALID_ACCESS: 'unauthorized, invalid access'
}

class Unauthorized extends BaseError {
  constructor(message) {
    super(message, 403)
  }
}

module.exports = {
  Unauthorized,
  ErrorMessage
}
