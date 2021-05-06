const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'message must have a title']
    },
    content: {
      type: String,
      required: [true, 'message must have content']
    },
    author: {
      type: String,
      required: [true, 'message must have an author']
    }
  },
  { timestamps: true }
)

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
