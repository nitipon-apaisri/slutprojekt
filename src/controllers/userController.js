const userModel = require('../models/userModel')

const createUser = async (req, res) => {
  const { username, password } = req.body
  const newUser = await userModel({
    username: username,
    password: password
  })
  await newUser.save()
  res.json({ message: 'Success', data: newUser })
}

module.exports = {
  createUser
}
