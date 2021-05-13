const BaseError = require('./base')

const ErrorMessage = {
  CLIENT_ID: 'client with provided id does not exist',
  TASK_ID: 'task with provided id does not exist',
  NO_MESSAGES: 'no messages found for task with provided id',
  NO_MESSAGE: 'message not found for task with provided id',
  USER_ID: 'user with provided id does not exist'
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
