const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
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
userSchema.pre('save', function () {
  const user = this
  if (user.isModified('password')) {
    user.password = bcrypt.hashSync(user.password, 10)
  }
})
userSchema.static('comparePassword', (password, userPassword) => {
  return bcrypt.compareSync(password, userPassword)
})
const user = mongoose.model('User', userSchema)
module.exports = user
