const messageValidation = require('../models/dto/messageDto')
const userValidation = require('../models/dto/userDto')
const taskValidation = require('../models/dto/taskDto')

const validateMessage = (req, res, next) => {
  const inputs = req.body
  try {
    messageValidation.postMessageValidation(inputs)
    next()
  } catch (error) {
    next(error)
  }
}

const validateUser = (req, res, next) => {
  const inputs = req.body
  const { method } = req
  try {
    method === 'POST'
      ? userValidation.postUserValidation(inputs)
      : userValidation.patchUserValidation(inputs)
    next()
  } catch (error) {
    next(error)
  }
}

const validateUserMe = (req, res, next) => {
  const inputs = req.body
  try {
    userValidation.patchMeValidation(inputs)
    next()
  } catch (error) {
    next(error)
  }
}

const validateTask = (req, res, next) => {
  const inputs = req.body
  const { method } = req
  try {
    method === 'POST'
      ? taskValidation.postTaskValidation(inputs)
      : taskValidation.patchTaskValidation(inputs)
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
