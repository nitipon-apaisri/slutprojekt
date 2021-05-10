const mongoose = require('mongoose')
const { Schema } = mongoose

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

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
