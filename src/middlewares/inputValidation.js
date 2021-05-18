const messageValidation = require('../models/dto/messageDto')
const userValidation = require('../models/dto/userDto')
const taskValidation = require('../models/dto/taskDto')
const invalidBodyError = require('../models/errors/invalidBody')
const { InvalidBodyError } = invalidBodyError

const validateMessage = (req, res, next) => {
  const inputs = req.body
  try {
    const validate = messageValidation.postValidation(inputs)
    if (validate.error) {
      throw new InvalidBodyError(invalidBodyError.ErrorMessage.TASK_MESSAGE)
    }
    next()
  } catch (error) {
    next(error)
  }
}

const validateUser = (req, res, next) => {
  const inputs = req.body
  const { method } = req
  let validation
  try {
    switch (method.toUpperCase()) {
      case 'POST': {
        validation = userValidation.postUserValidation(inputs)
        break
      }
      case 'PATCH': {
        validation = userValidation.patchUserValidation(inputs)
        break
      }
    }
    if (validation.error && method === 'POST') {
      throw new InvalidBodyError(
        invalidBodyError.ErrorMessage.USERNAME_PASSWORD
      )
    } else if (validation.error) {
      throw new InvalidBodyError(invalidBodyError.ErrorMessage.PATCH_USER)
    }
    next()
  } catch (error) {
    next(error)
  }
}

const validateUserMe = (req, res, next) => {
  const inputs = req.body
  try {
    const validate = userValidation.patchUserMeValidation(inputs)
    if (validate.error) {
      throw new InvalidBodyError(invalidBodyError.ErrorMessage.PATCH_USER_ME)
    }
    next()
  } catch (error) {
    next(error)
  }
}

const validateTask = (req, res, next) => {
  const inputs = req.body
  const { method } = req
  let validation
  try {
    switch (method.toUpperCase()) {
      case 'POST':
        validation = taskValidation.postTaskValidation(inputs)
        break
      case 'PATCH':
        validation = taskValidation.patchTaskValidation(inputs)
        break
    }

    if (validation.error && method.toUpperCase() === 'POST') {
      throw new InvalidBodyError(invalidBodyError.ErrorMessage.TASK_MESSAGE)
    } else if (validation.error) {
      throw new InvalidBodyError(invalidBodyError.ErrorMessage.UPDATE_TASK)
    }
    next()
  } catch (error) {
    next(error)
  }
}
module.exports = {
  validateMessage,
  validateUser,
  validateUserMe,
  validateTask
}
