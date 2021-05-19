const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const userModel = require('../models/userModel')
const notFoundErr = require('../models/errors/notFound')

const createUser = async (req, res, next) => {
  const query = req.body
  try {
    const newUser = await userModel.validateCreateUser(query)
    await newUser.save()
    res.json({ message: 'success' })
  } catch (error) {
    next(error)
  }
}

const signIn = async (req, res, next) => {
  const { username, password } = req.body

  try {
    const user = await userModel.validateUser(username, password)

    const payload = { id: user._id, role: user.role }
    const token = jwt.sign(payload, JWT_SECRET)
    res.json({ message: 'success', token })
  } catch (error) {
    next(error)
  }
}

const listUsers = async (req, res) => {
  const { role, search } = req.query

  const roleQuery = new RegExp(`.*${role && role !== 'all' ? role : ''}.*`, 'i')
  const searchQuery = new RegExp(`.*${search || ''}.*`, 'i')

  let filter = {
    role: { $regex: roleQuery },
    username: { $regex: searchQuery }
  }

  const users = await userModel.find(filter)

  const data = users.map(user => user.toObject())
  res.json({ data })
}

const getMe = async (req, res, next) => {
  const { id } = req.user
  try {
    const user = await userModel
      .findById(id)
      .populate({
        path: 'tasks',
        populate: { path: 'messages', model: 'Message' }
      })
    res.json({ data: user.toObject() })
  } catch (error) {
    next(error)
  }
}

const updateMe = async (req, res, next) => {
  const { id } = req.user
  const query = req.body

  try {
    await userModel.updateOne({ _id: id }, query, {
      new: true
    })
    res.json({ message: 'Update successful' })
  } catch (error) {
    next(error)
  }
}

const getUserById = async (req, res, next) => {
  const { id } = req.params
  try {
    const user = await userModel.findById(id)
    if (!user) {
      throw new notFoundErr.NotFoundError(notFoundErr.ErrorMessage.USER_ID)
    }
    res.json({ data: user.toObject() })
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req, res, next) => {
  const { id } = req.params
  const query = req.body
  try {
    await userModel.validateUpdateUser(id, query)

    res.json({ message: 'Update successful' })
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  const { id } = req.params
  try {
    const user = await userModel.findByIdAndDelete(id)
    if (!user) {
      throw new notFoundErr.NotFoundError(notFoundErr.ErrorMessage.USER_ID)
    }
    res.json({ message: 'Successfully deleted' })
  } catch (error) {
    next(error)
  }
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
