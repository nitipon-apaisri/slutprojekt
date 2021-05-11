const taskModel = require('../models/taskModel')
const userModel = require('../models/userModel')
const messageModel = require('../models/messageModel')

const invalidBody = require('../models/errors/invalidBody')
const { InvalidBodyError } = invalidBody

const notFound = require('../models/errors/notFound')
const { NotFoundError } = notFound

const unauthorized = require('../models/errors/unauthorized')
const { usersRoutes } = require('../routes')
const { Unauthorized } = unauthorized

const postCreateTask = async (req, res, next) => {
  try {
    const { user } = req
    const { title, info, clientId } = req.body

    if (!(title && info && clientId)) {
      throw new InvalidBodyError(invalidBody.ErrorMessage.POST_TASK)
    }

    const client = await userModel.findById(clientId)

    if (!client) {
      throw new NotFoundError(notFound.ErrorMessage.CLIENT_ID)
    }

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

    res.json({ newTask })
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

    const task = await taskModel.findById(taskId)
    if (!task) {
      throw new NotFoundError(notFound.ErrorMessage.TASK_ID)
    }

    if (role === 'client') {
      const client = await userModel.findById(id)
      const clientHasTask = client.tasks.find(t => t == taskId)

      if (!clientHasTask) {
        throw new Unauthorized(
          unauthorized.ErrorMessage.FORBIDDEN_INVALID_ACCESS
        )
      }
    }
    res.json(task)
  } catch (error) {
    next(error)
  }
}

const patchUpdateTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const query = req.body

    if (!Object.keys(query).length) {
      throw new InvalidBodyError(invalidBody.ErrorMessage.UPDATE_TASK)
    }

    if (!(query.title || query.info || query.client || query.completed)) {
      throw new InvalidBodyError(invalidBody.ErrorMessage.UPDATE_TASK)
    }

    const task = await taskModel.findByIdAndUpdate(id, query)

    if (!task) {
      throw new NotFoundError(notFound.ErrorMessage.TASK_ID)
    }

    res.json({ message: 'task updated', task })
  } catch (error) {
    next(error)
  }
}

const deleteTaskById = async (req, res, next) => {
  try {
    const { id } = req.params

    const task = await taskModel.findByIdAndDelete(id)

    if (!task) {
      throw new NotFoundError(notFound.ErrorMessage.TASK_ID)
    }

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
    if (!(title && content)) {
      throw new InvalidBodyError(invalidBody.ErrorMessage.TASK_MESSAGE)
    }

    const user = await userModel.findById(userId)
    const task = await taskModel.findById(taskId)

    if (!task) {
      throw new NotFoundError(notFound.ErrorMessage.TASK_ID)
    }
    const userHasTask = user.tasks.find(t => t == taskId)
    if (!userHasTask) {
      throw new Unauthorized(unauthorized.ErrorMessage.FORBIDDEN_INVALID_ACCESS)
    }

    const newMessage = await messageModel.create({
      title,
      content,
      author: user.username
    })
    await newMessage.save()

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
    const { role, id } = req.user

    const data = await taskModel.findById(taskId, 'messages').populate({
      path: 'messages',
      options: { limit: 2, sort: { created: -1 }, skip: 0 } //created: -1 or 0
    })

    if (!data) {
      throw new NotFoundError(notFound.ErrorMessage.NO_MESSAGES)
    }

    if (role === 'client') {
      const client = await userModel.findById(id)
      const clientHasTask = client.tasks.find(t => t == taskId)

      if (!clientHasTask) {
        throw new Unauthorized(
          unauthorized.ErrorMessage.FORBIDDEN_INVALID_ACCESS
        )
      }
    }

    res.json(data.messages)
  } catch (error) {
    next(error)
  }
}

const deleteMessage = async (req, res, next) => {
  try {
    const taskId = req.params.id
    const messageId = req.params.msg_id

    const task = await taskModel.findById(taskId).populate('messages')
    if (!task) {
      throw new NotFoundError(notFound.ErrorMessage.TASK_ID)
    }

    await task.authAuthor(req.user.id, messageId)
    task.messages.pull({ _id: messageId })
    await task.save()

    await messageModel.findByIdAndDelete(messageId)

    res.json({ message: 'message deleted' })
  } catch (error) {
    next(error)
  }
}

const postTaskImage = async (req, res, next) => {
  const { id } = req.params
  const { buffer } = req.file
  try {
    const task = await taskModel.findById(id)
    if (!task) {
      throw new NotFoundError(notFound.ErrorMessage.TASK_ID)
    }
    task.image = buffer
    task.save()
    res.json({ message: 'success', task })
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
  deleteMessage,
  postTaskImage
}
