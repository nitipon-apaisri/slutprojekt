const Task = require('../models/Task')
const User = require('../models/userModel')

const postCreateTask = async (req, res, next) => {
  try {
    const { user } = req

    const { title, info, clientId } = req.body
    const client = await User.findById(clientId)

    const newTask = await Task.create({
      title,
      info,
      client: client.userName
    })

    const existingUser = await User.findById(user.id)
    existingUser.tasks.push(newTask)
    client.tasks.push(newTask)

    await newTask.save()
    await existingUser.save()
    await client.save()

    res.json({ message: 'success' })
  } catch (error) {
    next(error)
  }
}

const getTasks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    const tasks = user.tasks
    res.json(tasks)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  postCreateTask,
  getTasks
}
