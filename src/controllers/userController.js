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
  const { username, password, role } = req.body
  const payload = { username: username, role: role }
  const token = jwt.sign(payload, JWT_SECRET)
  const findUser = await userModel.findOne({ username }).exec()
  if (userModel.comparePassword(password, findUser.password)) {
    res.json({ data: findUser, token: token })
  } else {
    res.json({ message: 'Username or password is incorrect' })
  }
}

module.exports = {
  createUser,
  signIn
}
