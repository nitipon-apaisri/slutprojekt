const BaseError = require('./base')

const ErrorMessage = {
  USERNAME_PASSWORD: 'username and password needs to be provided'
}

class InvalidBodyError extends BaseError {
  constructor(message) {
    super(message, 404)
  }
}

module.exports = {
  InvalidBodyError,
  ErrorMessage
}
