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
      type: Buffer
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
    ],
    errorReports: [{ type: mongoose.Types.ObjectId, ref: 'ErrorReport' }]
  },
  { timestamps: true }
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

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
