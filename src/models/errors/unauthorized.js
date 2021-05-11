const BaseError = require('./base')

const ErrorMessage = {
  FORBIDDEN: 'unauthorized action please login',
  FORBIDDEN_INVALID_TOKEN: 'unauthorized, invalid token',
  FORBIDDEN_INVALID_ACCESS: 'unauthorized, invalid access'
}

class UnauthorizedError extends BaseError {
  constructor(message) {
    super(message, 403)
  }
}

module.exports = {
  UnauthorizedError,
  ErrorMessage
}
