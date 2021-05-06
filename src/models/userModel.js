const mongoose = require('mongoose')
const { Schema } = mongoose
const userSchema = new Schema({
  username: String,
  password: String,
  role: Enumerator,
  createdAt: Date
})

const user = mongoose.model('user', userSchema)
module.exports = user
