const BaseError = require('./base')

const ErrorMessage = {
  USERNAME_PASSWORD: 'invalid username or password'
}

class AuthenticateError extends BaseError {
  constructor(message, errorCode) {
    super(message, errorCode)
  }
}

module.exports = { AuthenticateError, ErrorMessage }
