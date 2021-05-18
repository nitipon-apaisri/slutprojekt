const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { InvalidBodyError } = require('../errors/invalidBody')

const postTaskSchema = Joi.object({
  title: Joi.string().required(),
  info: Joi.string().required(),
  clientId: Joi.objectId().required(),
  completed: Joi.boolean().optional()
})

const patchTaskSchema = postTaskSchema.fork(
  ['title', 'info', 'clientId'],
  key => key.optional()
)

const postTaskValidation = inputs => {
  const { error } = postTaskSchema.validate(inputs)
  if (error) {
    throw new InvalidBodyError(error)
  }
}

const patchTaskValidation = inputs => {
  const { error } = patchTaskSchema.validate(inputs)
  if (error) {
    throw new InvalidBodyError(error)
  }
}

module.exports = {
  postTaskValidation,
  patchTaskValidation
}
