require('dotenv').config({ path: '../../config/.env' })
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const userModel = require('../models/userModel')

const createUser = async (req, res) => {
  const { username, password, role } = req.body
  const hash = bcrypt.hashSync(password, 10)
  const newUser = await userModel({
    username: username,
    password: hash,
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
  bcrypt.compare(password, findUser.password, (err, response) => {
    if (response === true) {
      res.json({ data: findUser, token: token })
    } else {
      res.json({ message: 'username or password is wrong' })
    }
  })
}

module.exports = {
  createUser,
  signIn
}
