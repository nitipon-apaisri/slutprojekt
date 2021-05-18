const Joi = require('joi')

const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required()
})

const postValidation = inputs => {
  return postSchema.validate(inputs)
}

module.exports = { postValidation }
