const taskModel = require('../models/taskModel')
const userModel = require('../models/userModel')
const messageModel = require('../models/messageModel')

const postCreateTask = async (req, res, next) => {
  try {
    const { user } = req
    const { title, info, clientId } = req.body
    const client = await userModel.findById(clientId)

    const newTask = await taskModel.create({
      title,
      info,
      client: client.userName
    })

    const existingUser = await userModel.findById(user.id)
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
    const user = await userModel.findById(req.user.id)
    const tasks = user.tasks

    const { filter, search } = req.query
    if (search) {
      tasks = tasks.filter(t => t.client.includes(search))
    }
    if (filter === 'done') {
      tasks = tasks.filter(t => t.completed === 'done')
    }
    res.json(tasks)
  } catch (error) {
    next(error)
  }
}

const getTaskById = async (req, res, next) => {
  try {
    const taskId = req.params.id

    const { role, id } = req.user
    if (role === 'client') {
      const user = await userModel.findById(id)
      const userTasks = user.tasks
      const task = userTasks.filter(t => t._id === req.params.id)
      res.json(task)
    } else {
      const task = await taskModel.findById(taskId)
      res.json(task)
    }
  } catch (error) {
    next(error)
  }
}

const patchUpdateTask = async (req, res, next) => {
  try {
    const taskId = req.params.id
    const { title, info, clientId, completed } = req.body
    const updateTask = await taskModel.updateOne(
      { _id: taskId },
      {
        title,
        info,
        clientId,
        completed
      }
    )
    await updateTask.save()
    res.json({ message: 'updated' })
  } catch (error) {
    next(error)
  }
}

const deleteTaskById = async (req, res, next) => {
  try {
    const taskId = req.params.id
    const deleteTask = await taskModel.findByIdAndDelete(taskId)
    await deleteTask.save()
    res.json({ message: 'deleted' })
  } catch (error) {
    next(error)
  }
}

const postMessageToTask = async (req, res, next) => {
  try {
    const userId = req.user.id
    const taskId = req.params.id
    const { title, content } = req.body

    const user = await userModel.findById(userId)

    const newMessage = await messageModel.create({
      title,
      content,
      author: user.userName
    })
    await newMessage.save()

    const task = await taskModel.findById(taskId)
    task.messages.push(newMessage)
    await task.save()
  } catch (error) {
    next(error)
  }
}

const getAllMessagesFromTask = async (req, res, next) => {
  try {
    const taskId = req.params.id

    const task = await taskModel.findById(taskId)
    const messages = task.messages
    //messages.sort((a, b) => a.createdAt - b.createdAt)
    const { page = 1, limit = 10 } = req.query
    const startAt = page - 1 * limit
    const endAt = startAt + limit - 1
    const messagesPerPage = messages.slice(startAt, endAt)

    res.json(messagesPerPage)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  postCreateTask,
  getTasks,
  getTaskById,
  patchUpdateTask,
  deleteTaskById,
  getAllMessagesFromTask,
  postMessageToTask
}
