const usersRoutes = require('./usersRoutes')
const taskRoutes = require('./tasksRoutes')
const genericRoutes = require('./genericRoutes')

module.exports = {
  usersRoutes,
  taskRoutes,
  genericRoutes
}

// const express = require('express')
// const router = express.Router()
// const userController = require('../controllers/userController')

// router.post('/users', userController.createUser)
// router.get('/users', userController.signIn)
// router.patch('/users/:id', userController.updateUser)
// module.exports = router
