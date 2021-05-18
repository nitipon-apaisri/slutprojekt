const Joi = require('joi')
const { InvalidBodyError } = require('../errors/invalidBody')

const postMessageSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required()
})

const postMessageValidation = inputs => {
  const { error } = postMessageSchema.validate(inputs)
  if (error) {
    throw new InvalidBodyError(error)
  }
}

module.exports = { postMessageValidation }
