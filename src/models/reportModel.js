const mongoose = require('mongoose')
const { Schema } = mongoose

const reportSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'message must have a title']
    },
    content: {
      type: String,
      required: [true, 'message must have content']
    },
    image: {
      type: Buffer
    }
  },
  { timestamps: true }
)

const report = mongoose.model('report', reportSchema)

module.exports = report
