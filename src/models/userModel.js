const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const alreadyExistsError = require('./errors/alreadyExists')
const authenticateError = require('./errors/authenticate')

const { AuthenticateError } = authenticateError
const { AlreadyExistsError } = alreadyExistsError
const { Schema } = mongoose

const userSchema = new Schema(
  {
    username: String,
    password: String,
    role: {
      type: String,
      enum: ['client', 'admin', 'worker'],
      default: 'worker'
    },
    profile: {
      firstName: String,
      lastName: String,
      age: Number
    },
    tasks: [{ type: mongoose.Types.ObjectId, ref: 'Task' }]
  },
  {
    timestamps: true,
    toObject: {
      transform(_, user) {
        delete user.password
        delete user.__v
      }
    }
  }
)

userSchema.pre('validate', function () {
  const user = this
  if (user.isModified('password')) {
    user.password = bcrypt.hashSync(user.password, 10)
  }
})

userSchema.pre('updateOne', function () {
  const user = this
  const updateUser = user.getUpdate()
  if (updateUser.password) {
    updateUser.password = bcrypt.hashSync(updateUser.password, 10)
  }
})

userSchema.statics.validateCreateUser = async function (query) {
  const user = await this.findOne({ username: query.username })
  if (user) {
    throw new AlreadyExistsError(alreadyExistsError.ErrorMessage.USER)
  }
  return await this.create({ ...query, tasks: [], profile: {} })
}

userSchema.statics.validateUser = async function (username, password) {
  const user = await this.findOne({ username })

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new AuthenticateError(
      authenticateError.ErrorMessage.USERNAME_PASSWORD,
      409
    )
  }
  return user
}
const user = mongoose.model('User', userSchema)
module.exports = user
