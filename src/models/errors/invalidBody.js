const BaseError = require('./base')

const ErrorMessage = {
  USERNAME_PASSWORD: 'username and password needs to be provided',
  BODY: 'Invalid body',
  POST_TASK: 'title, info and clientId need to be provided',
  UPDATE_TASK: 'title, info, client or completed needs to be provided',
  TASK_MESSAGE: 'title and content need to be provided'
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
