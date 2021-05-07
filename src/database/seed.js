const userModel = require('../models/userModel')

const seed = async () => {
  const userAdmin = await userModel.create({
    username: 'admin',
    password: 'admin',
    role: 'admin'
  })
  userAdmin.save()
}
module.exports = seed
