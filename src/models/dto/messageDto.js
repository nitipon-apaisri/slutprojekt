const Joi = require('joi')
const { InvalidBodyError } = require('../errors/invalidBody')

const postMessageSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required()
}).error(new Error('invalid body: title and content are required'))

const postMessageValidation = inputs => {
  const { error } = postMessageSchema.validate(inputs)
  if (error) {
    throw new InvalidBodyError(error.toString().replace('Error: ', ''))
  }
}

module.exports = { postMessageValidation }
