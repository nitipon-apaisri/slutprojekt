const authError = require('../models/errors/unauthorized')

const Role = {
  ADMIN: 'admin',
  CLIENT: 'client',
  WORKER: 'worker'
}

const authInvalidAccessError = () => {
  throw new authError.Unauthorized(
    authError.ErrorMessage.FORBIDDEN_INVALID_ACCESS
  )
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

const clientAccess = (req, res, next) =>
  hasRole(req.user.role, Role.CLIENT) ? next() : authInvalidAccessError()

module.exports = {
  workerAccess,
  workerAndClientAccess,
  workerAndAdminAccess,
  adminAccess,
  clientAccess
}
