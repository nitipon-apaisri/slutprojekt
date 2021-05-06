const jwt = require('jsonwebtoken')

const authorization = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    throw new Error('Unauthorized')
  }
  const token = authorization.replace('Bearer ', '')
  req.user = jwt.verify(token, process.env.JWT_SECRET)
  next()
}

const rbac = (req, res, next) => {
  const { role } = req.user
  return (...validRoles) => validRoles.includes(role)
}

module.exports = {
  authorization,
  rbac
}
