const BaseError = require('./base')

const ErrorMessage = {
  TASK_ID: 'taskId must be provided in params'
}

class InvalidParamsError extends BaseError {
  constructor(message) {
    super(message, 404)
  }
}

module.exports = {
  InvalidParamsError,
  ErrorMessage
}
