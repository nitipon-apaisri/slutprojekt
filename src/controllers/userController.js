require('dotenv').config({ path: '../../config/.env' })
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const userModel = require('../models/userModel')

const createUser = async (req, res) => {
  const { username, password, role } = req.body
  const newUser = await userModel({
    username: username,
    password: password,
    role: role
  })
  await newUser.save()
  res.json({ message: 'Success', data: newUser })
}

const signIn = async (req, res) => {
  const { username, password } = req.body
  const findUser = await userModel.findOne({ username }).exec()
  if (!userModel.comparePassword(password, findUser.password)) {
    return res.json({ message: 'Username or password is incorrect' })
  }
  const payload = { username: findUser._id, role: findUser.role }
  const token = jwt.sign(payload, JWT_SECRET)
  res.json({ data: findUser, token: token })
}

const updateUser = async (req, res) => {
  const id = req.params.id
  const changeInfo = req.body
  if (Object.keys(changeInfo).length !== 0) {
    await userModel.updateOne({ _id: id }, changeInfo, {
      new: true
    })
  } else {
    return res.status(400).json({ message: 'No body provide' })
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
  deleteUser
}
