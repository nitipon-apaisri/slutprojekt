const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel')

const createUser = async (req, res) => {
  const { username, password } = req.body
  const hash = bcrypt.hashSync(password, 10)
  const newUser = await userModel({
    username: username,
    password: hash
  })
  await newUser.save()
  res.json({ message: 'Success', data: newUser })
}

// const signIn = async (req,res) => {
//     const {username, password} = req.body
// }

module.exports = {
  createUser
}
