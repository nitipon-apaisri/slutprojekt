const mongoose = require('mongoose')
const { Schema } = mongoose
const messageModel = require('./messageModel')
const userModel = require('./userModel')

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
    ]
  },
  { timestamps: true }
)

taskSchema.methods.authAuthor = async function (userId, messageId) {
  const task = this
  const user = await userModel.findById(userId)
  const message = task.messages.find(message => message._id == messageId)

  if (!message) {
    throw new Error('message not found')
  }
  if (message.author !== user.username) {
    throw new Error('only the author can delete the message')
  }
}

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
