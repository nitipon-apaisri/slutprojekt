const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const postTaskSchema = Joi.object({
  title: Joi.string().required(),
  info: Joi.string().required(),
  clientId: Joi.objectId().required()
})

const patchTaskSchema = postTaskSchema.fork(
  ['title', 'info', 'clientId'],
  key => key.optional()
)

const postTaskValidation = inputs => {
  return postTaskSchema.validate(inputs)
}

const patchTaskValidation = inputs => {
  return patchTaskSchema.validate(inputs)
}

module.exports = {
  postTaskValidation,
  patchTaskValidation
}
