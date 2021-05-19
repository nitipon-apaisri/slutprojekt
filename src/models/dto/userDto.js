const Joi = require('joi')
const { InvalidBodyError } = require('../errors/invalidBody')

const postUserSchema = Joi.object({
  username: Joi.string().min(5).required(),
  password: Joi.string().min(5).required(),
  role: Joi.string().optional(),
  profile: Joi.object().optional().options({ allowUnknown: true })
}).error(
  new Error(
    'invalid body, username and password is required, role and profile is optional'
  )
)

const patchUserSchema = postUserSchema
  .fork(['username', 'password'], key => key.optional())
  .min(1)
  .error(
    new Error(
      'invalid body, optional values are: username, password, role and profile'
    )
  )

const patchMeSchema = patchUserSchema
  .fork('role', key => key.forbidden())
  .min(1)
  .error(
    new Error(
      'invalid body, optional values are: username, password and profile'
    )
  )

const errorHandler = message => {
  throw new InvalidBodyError(message.toString().replace('Error: ', ''))
}

const postUserValidation = inputs => {
  const { error } = postUserSchema.validate(inputs)
  if (error) {
    errorHandler(error)
  }
}

const patchUserValidation = inputs => {
  const { error } = patchUserSchema.validate(inputs)
  if (error) {
    errorHandler(error)
  }
}

const patchMeValidation = inputs => {
  const { error } = patchMeSchema.validate(inputs)
  if (error) {
    errorHandler(error)
  }
}

module.exports = {
  postUserValidation,
  patchUserValidation,
  patchMeValidation
}
