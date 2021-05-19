const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { InvalidBodyError } = require('../errors/invalidBody')

const postTaskSchema = Joi.object({
  title: Joi.string().required(),
  info: Joi.string().required(),
  clientId: Joi.objectId().required(),
  completed: Joi.boolean().optional()
}).error(
  new Error(
    'invalid body: title, info and clientId are required, completed is optional'
  )
)

const patchTaskSchema = postTaskSchema
  .fork(['title', 'info', 'clientId'], key => key.optional())
  .min(1)
  .error(
    new Error(
      'invalid body, optional values are: title, info, clientId and completed'
    )
  )

const errorHandler = message => {
  throw new InvalidBodyError(message.toString().replace('Error: ', ''))
}

const postTaskValidation = inputs => {
  const { error } = postTaskSchema.validate(inputs)
  if (error) {
    errorHandler(error)
  }
}

const patchTaskValidation = inputs => {
  const { error } = patchTaskSchema.validate(inputs)
  if (error) {
    errorHandler(error)
  }
}

module.exports = {
  postTaskValidation,
  patchTaskValidation
}
