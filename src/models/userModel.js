const mongoose = require('mongoose')
const { Schema } = mongoose
const userSchema = new Schema(
  {
    username: String,
    password: String,
    role: {
      type: String,
      enum: ['client', 'admin', 'worker'],
      default: 'worker'
    }
    //tasks: [{type: mongoose.Types.ObjectId, ref: 'Task'}]
  },
  { timestamps: true }
)

const user = mongoose.model('User', userSchema)
module.exports = user
