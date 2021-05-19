const { prodConnect } = require('./connection')
const userModel = require('../models/userModel')

productionSeed = async () => {
  await prodConnect()
  const user = await userModel.create({
    username: 'admin',
    password: process.env.SEEDED_ADMIN_PASSWORD
  })
  await user.save()
  process.exit(0)
}
