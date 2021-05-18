const Joi = require('joi')

const postUserSchema = Joi.object({
  username: Joi.string().min(5).required(),
  password: Joi.string().min(5).required(),
  role: Joi.string().optional(),
  profile: Joi.object().optional().options({ allowUnknown: true })
})

const patchUserSchema = postUserSchema.fork(['username', 'password'], key =>
  key.optional()
)

const patchMeSchema = patchUserSchema.fork('role', key => key.forbidden())

const postUserValidation = inputs => {
  return postUserSchema.validate(inputs)
}

const patchUserValidation = inputs => {
  return patchUserSchema.validate(inputs)
}

const patchUserMeValidation = inputs => {
  return patchMeSchema.validate(inputs)
}

module.exports = {
  postUserValidation,
  patchUserValidation,
  patchUserMeValidation
}
