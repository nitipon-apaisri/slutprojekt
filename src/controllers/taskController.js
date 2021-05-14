const taskModel = require('../models/taskModel')
const reportModel = require('../models/reportModel')
const userModel = require('../models/userModel')
const messageModel = require('../models/messageModel')

const invalidBody = require('../models/errors/invalidBody')
const { InvalidBodyError } = invalidBody

const notFound = require('../models/errors/notFound')
const { NotFoundError } = notFound

const unauthorized = require('../models/errors/unauthorized')
const { report } = require('../routes/usersRoutes')
const { UnauthorizedError } = unauthorized

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

    res.json({ data: newTask.toObject() })
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
    const data = tasks.map(task => task.toObject())
    res.json(data)
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
      await task.authTaskAccess(id, taskId)
    }

    const data = task.toObject()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

const patchUpdateTask = async (req, res, next) => {
  try {
    const taskId = req.params.id
    const query = req.body
    const { user } = req

    if (!Object.keys(query).length) {
      throw new InvalidBodyError(invalidBody.ErrorMessage.UPDATE_TASK)
    }

    if (!(query.title || query.info || query.client || query.completed)) {
      throw new InvalidBodyError(invalidBody.ErrorMessage.UPDATE_TASK)
    }

    const task = await taskModel.findByIdAndUpdate(taskId, query)

    if (!task) {
      throw new NotFoundError(notFound.ErrorMessage.TASK_ID)
    }

    await task.authTaskAccess(user.id, taskId)

    res.json({ message: 'task updated' })
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

    await task.authTaskAccess(userId, taskId)

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
    const { id } = req.user
    const { limit = 2, page = 1 } = req.query

    const task = await taskModel.findById(taskId, 'messages').populate({
      path: 'messages',
      options: { limit, sort: { createdAt: -1 }, skip: limit * (page - 1) }
    })

    if (!task) {
      throw new NotFoundError(notFound.ErrorMessage.NO_MESSAGES)
    }

    await task.authTaskAccess(id, taskId)

    const data = task.messagesToObject()
    res.json(data)
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
  const { path } = req.file

  const filePath = path.replace('public/', '')
  try {
    const fileUrl =
      process.env.NODE_ENV === 'dev'
        ? process.env.IMAGE_URL.replace('PORT', process.env.PORT).concat(
            `/${filePath}`
          )
        : process.env.IMAGE_URL.concat(`/${filePath}`)
    const task = await taskModel.findById(id)
    if (!task) {
      throw new NotFoundError(notFound.ErrorMessage.TASK_ID)
    }
    task.image = fileUrl

    await task.save()
    res.json({ message: 'success', data: task.image })
  } catch (error) {
    next(error)
  }
}

const postReport = async (req, res, next) => {
  const id = req.params.id
  const { title, content, img } = req.body
  try {
    const task = await taskModel.findById(id)
    if (!task) {
      throw new NotFoundError(notFound.ErrorMessage.TASK_ID)
    } else {
      const newReport = await reportModel.create({ title, content })
      const existingTasks = await taskModel.findById({
        _id: id
      })
      await newReport.save()
      existingTasks.errorReports.push(newReport)
      await existingTasks.save()
      res.json({ report: newReport, updated: existingTasks })
    }
  } catch (error) {
    next(error)
  }
}

const getReport = async (req, res, next) => {
  const id = req.params.id
  try {
    const task = await taskModel.findById(id).populate('errorReports')
    if (!task) {
      throw new NotFoundError(notFound.ErrorMessage.TASK_ID)
    } else {
      res.json({ task: task })
    }
  } catch (err) {
    next(err)
  }
}

const updateReport = async (req, res, next) => {
  const id = req.params.id
  const changeContent = req.body
  try {
    const task = await taskModel.findById(id)
    if (!task) {
      throw new NotFoundError(notFound.ErrorMessage.TASK_ID)
    } else {
      const reports = task.errorReports[0]
      await reportModel.updateOne({ _id: reports }, changeContent, {
        new: true
      })
      const findReport = await reportModel.findById(reports)
      res.json({ data: findReport })
    }
  } catch (err) {
    next(err)
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
  postTaskImage,
  postReport,
  getReport,
  updateReport
}
