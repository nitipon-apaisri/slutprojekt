const BaseError = require('./base')

const ErrorMessage = {
  USER: 'a user with that username already exists'
}

class AlreadyExistsError extends BaseError {
  constructor(message) {
    super(message, 409)
  }
}

module.exports = {
  AlreadyExistsError,
  ErrorMessage
}
