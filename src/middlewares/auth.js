const jwt = require('jsonwebtoken')
const authError = require('../models/errors/unauthorized')
const { UnauthorizedError } = authError

const authorizationError = message => {
  throw new UnauthorizedError(message)
}

const authorization = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    authorizationError(authError.ErrorMessage.FORBIDDEN)
  }
  const token = authorization.replace('Bearer ', '')
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    authorizationError(authError.ErrorMessage.FORBIDDEN_INVALID_TOKEN)
  }
  next()
}

module.exports = {
  authorization
}
