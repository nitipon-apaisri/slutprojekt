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
      client: client.username
    })

    const existingUser = await userModel.findById(user.id)
    existingUser.tasks.push(newTask)
    client.tasks.push(newTask)

    await newTask.save()
    await existingUser.save()
    await client.save()

    res.json({ client, existingUser, newTask })
  } catch (error) {
    next(error)
  }
}

const getTasks = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id).populate('tasks')
    let tasks = user.tasks
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
      const client = await userModel.findById(id).populate('tasks')
      const tasks = client.tasks
      const task = tasks.find(t => t._id == taskId)
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

    await taskModel.updateOne(
      { _id: taskId },
      {
        title,
        info,
        clientId,
        completed
      }
    )

    res.json({ message: 'task updated' })
  } catch (error) {
    next(error)
  }
}

const deleteTaskById = async (req, res, next) => {
  try {
    const taskId = req.params.id
    await taskModel.findByIdAndDelete(taskId)

    res.json({ message: 'task deleted' })
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
      author: user.username
    })
    await newMessage.save()

    const task = await taskModel.findById(taskId)
    task.messages.push(newMessage)
    await task.save()

    res.json({ message: 'message posted' })
  } catch (error) {
    next(error)
  }
}

const getAllMessagesFromTask = async (req, res, next) => {
  try {
    const taskId = req.params.id

    const data = await taskModel.findById(taskId, 'messages').populate({
      path: 'messages',
      options: { limit: 2, sort: { created: -1 }, skip: 0 } //created: -1 or 0
    })
    const { messages } = data
    res.json(messages)
  } catch (error) {
    next(error)
  }
}

const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.body
    const taskId = req.params.id

    const task = await taskModel.findById(taskId).populate('messages')

    await task.authAuthor(req.user.id, messageId)

    task.messages.pull({ _id: messageId })
    await task.save()

    await messageModel.findByIdAndDelete(messageId)

    res.json({ message: 'message deleted' })
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
  postMessageToTask,
  deleteMessage
}
