const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const userModel = require('../models/userModel')
const authErr = require('../models/errors/authenticate')
const bodyErr = require('../models/errors/invalidBody')
const createUser = async (req, res, next) => {
  const query = req.body
  try {
    if (!query.username || !query.password) {
      throw new bodyErr.InvalidBodyError(bodyErr.ErrorMessage.USERNAME_PASSWORD)
    }

    const newUser = await userModel.validateCreateUser(query)
    await newUser.save()
    res.json({ message: 'success' })
  } catch (error) {
    next(error)
  }
}

const signIn = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400).json({ message: bodyErr.ErrorMessage.BODY })
  } else {
    const findUser = await userModel.findOne({ username })
    if (!userModel.comparePassword(password, findUser.password)) {
      return res
        .status(401)
        .json({ message: authErr.ErrorMessage.USERNAME_PASSWORD })
    }
    const payload = { id: findUser._id, role: findUser.role }
    const token = jwt.sign(payload, JWT_SECRET)
    res.json({ data: findUser, token: token })
  }
}

const listUsers = async (req, res) => {
  const role = req.query.role
  const search = req.query.search
  const requestQuery = req.query
  if (Object.keys(requestQuery).length === 0) {
    const findUsers = await userModel.find()
    res.json({ data: findUsers })
  } else {
    if (Object.keys(requestQuery) == 'role') {
      if (role.length === 0) {
        res.status(400).json({ message: 'Invalid params' })
      } else {
        if (role === 'all') {
          const findUsers = await userModel.find()
          res.json({ data: findUsers })
        } else {
          const findUsers = await userModel.find({ role: role })
          res.json({ data: findUsers })
        }
      }
    }
    if (Object.keys(requestQuery) == 'search') {
      if (search === undefined) {
        const findUsers = await userModel.find()
        res.json({ data: findUsers })
      } else {
        if (search.length === 0) {
          res.status(400).json({ message: 'Invalid params' })
        } else {
          const findUsers = await userModel.find({ username: search })
          res.json({ data: findUsers })
        }
      }
    }
  }
}

const getMe = async (req, res) => {
  const userId = req.user.username
  const findUser = await userModel.findById({ _id: userId })
  res.json({ data: findUser })
}

const updateMe = async (req, res) => {
  const userId = req.user.username
  const changeInfo = req.body
  if (Object.keys(changeInfo).length !== 0) {
    await userModel.updateOne({ _id: userId }, changeInfo, {
      new: true
    })
    res.json({ message: 'Update successful' })
  } else {
    return res.status(400).json({ message: bodyErr.ErrorMessage.BODY })
  }
  const findUser = await userModel.findById({ _id: userId })
  res.json({ message: findUser })
}

const getUserById = async (req, res) => {
  const id = req.params.id
  const findAnUser = await userModel.findById({ _id: id })
  res.json({ data: findAnUser })
}

const updateUser = async (req, res) => {
  const id = req.params.id
  const changeInfo = req.body
  if (Object.keys(changeInfo).length !== 0) {
    await userModel.updateOne({ _id: id }, changeInfo, {
      new: true
    })
  } else {
    return res.status(400).json({ message: bodyErr.ErrorMessage.BODY })
  }
  const findUser = await userModel.findById({ _id: id })
  res.json({ message: findUser })
}

const deleteUser = async (req, res) => {
  const id = req.params.id
  await userModel.deleteOne({ _id: id }, function (err) {
    if (err) {
      res.json({ message: err })
    } else {
      res.json({ message: 'Successful delation' })
    }
  })
}

module.exports = {
  createUser,
  signIn,
  updateUser,
  deleteUser,
  listUsers,
  getUserById,
  getMe,
  updateMe
}
