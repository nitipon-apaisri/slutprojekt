const Joi = require('joi')
const { InvalidBodyError } = require('../errors/invalidBody')

const postUserSchema = Joi.object({
  username: Joi.string().min(5).required(),
  password: Joi.string().min(5).required(),
  role: Joi.string().optional(),
  profile: Joi.object().optional().options({ allowUnknown: true })
})

const patchUserSchema = postUserSchema
  .fork(['username', 'password'], key => key.optional())
  .min(1)

const patchMeSchema = patchUserSchema
  .fork('role', key => key.forbidden())
  .min(1)

const postUserValidation = inputs => {
  const { error } = postUserSchema.validate(inputs)
  if (error) {
    throw new InvalidBodyError(error)
  }
}

const patchUserValidation = inputs => {
  const { error } = patchUserSchema.validate(inputs)
  if (error) {
    throw new InvalidBodyError(error)
  }
}

const patchMeValidation = inputs => {
  const { error } = patchMeSchema.validate(inputs)
  if (error) {
    throw new InvalidBodyError(error)
  }
}

module.exports = {
  postUserValidation,
  patchUserValidation,
  patchMeValidation
}
