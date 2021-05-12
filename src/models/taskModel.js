const mongoose = require('mongoose')
const { Schema } = mongoose
const userModel = require('./userModel')

const notFound = require('./errors/notFound')
const { NotFoundError } = notFound

const unauthorized = require('./errors/unauthorized')
const { UnauthorizedError } = unauthorized

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Task must have a title.']
    },
    info: {
      type: String,
      required: [true, 'Task must have a description.']
    },
    image: {
      type: String
    },
    client: {
      type: String
    },
    completed: {
      type: String,
      default: false
    },
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Message'
      }
    ]
  },
  {
    timestamps: true,
    toObject: {
      transform(_, task) {
        delete task.__v
      }
    }
  }
)

taskSchema.methods.authAuthor = async function (userId, messageId) {
  const task = this
  const user = await userModel.findById(userId)
  const message = task.messages.find(message => message._id == messageId)

  if (!message) {
    throw new NotFoundError(notFound.ErrorMessage.NO_MESSAGE)
  }
  if (message.author !== user.username) {
    throw new UnauthorizedError(
      unauthorized.ErrorMessage.FORBIDDEN_INVALID_ACCESS
    )
  }
}

taskSchema.methods.authTaskAccess = async function (userId, taskId) {
  const user = await userModel.findById(userId)
  const userHasTask = user.tasks.find(t => t == taskId)

  if (!userHasTask) {
    throw new UnauthorizedError(
      unauthorized.ErrorMessage.FORBIDDEN_INVALID_ACCESS
    )
  }
}

taskSchema.methods.messagesToObject = function () {
  return this.messages.map(message => message.toObject())
}

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
