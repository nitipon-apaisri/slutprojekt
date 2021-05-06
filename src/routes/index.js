const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/users', userController.createUser)
router.get('/users', userController.signIn)

const taskController = require('../controllers/taskController')
router.post('/tasks', taskController.postCreateTask)
router.get('/tasks', taskController.getTasks)

module.exports = router
