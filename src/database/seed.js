const userModel = require('../models/userModel')

const seed = async () => {
  const userAdmin = await userModel.create({
    username: 'admin',
    password: 'admin',
    role: 'admin'
  })
  userAdmin.save()

  const userWorker = await userModel.create({
    username: 'worker',
    password: 'worker',
    role: 'worker'
  })
  userWorker.save()

  const userClient = await userModel.create({
    username: 'client',
    password: 'client',
    role: 'client'
  })
  userClient.save()
}
module.exports = seed
