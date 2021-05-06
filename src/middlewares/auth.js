const jwt = require('jsonwebtoken')
const authErrorModel = require('../models/errors/unauthorized')

const Roles = {
  ADMIN: 'admin',
  CLIENT: 'client',
  WORKER: 'worker'
}

const authError = message => {
  throw new authErrorModel.Unauthorized(message)
}

const authInvalidAccessError = () => {
  throw new authErrorModel.Unauthorized(
    authErrorModel.ErrorMessage.FORBIDDEN_INVALID_ACCESS
  )
}

const authorization = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    throw new Error('Unauthorized')
  }
  const token = authorization.replace('Bearer ', '')
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    authError(authErrorModel.ErrorMessage.FORBIDDEN_INVALID_TOKEN)
  }
  next()
}

const Role = {
  ADMIN: 'admin',
  CLIENT: 'client',
  WORKER: 'worker'
}

const hasRole = (role, ...roles) => roles.includes(role)

const workerAccess = (req, res, next) =>
  hasRole(req.user.role, Role.WORKER) ? next() : authInvalidAccessError()

const workerAndClientAccess = (req, res, next) =>
  hasRole(req.user.role, Role.WORKER, Role.CLIENT)
    ? next()
    : authInvalidAccessError()

const workerAndAdminAccess = (req, res, next) =>
  hasRole(req.user.role, Role.WORKER, Role.ADMIN)
    ? next()
    : authInvalidAccessError()

const adminAccess = (req, res, next) =>
  hasRole(req.user.role, Role.ADMIN) ? next() : authInvalidAccessError()

module.exports = {
  authorization,
  workerAccess,
  workerAndClientAccess,
  workerAndAdminAccess,
  adminAccess
}
