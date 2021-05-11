const BaseError = require('./base')

const ErrorMessage = {
  CLIENT_ID: 'client with provided id does not exist',
  TASK_ID: 'task with provided id does not exist'
}

class NotFoundError extends BaseError {
  constructor(message) {
    super(message, 404)
  }
}

module.exports = {
  NotFoundError,
  ErrorMessage
}
