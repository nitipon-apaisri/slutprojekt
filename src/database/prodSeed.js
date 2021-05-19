const { prodConnect } = require('./connection')
const userModel = require('../models/userModel')

;(async () => {
  await prodConnect()
  try {
    const user = await userModel.create({
      username: 'admin',
      password: process.env.SEEDED_ADMIN_PASSWORD,
      role: 'admin'
    })
    await user.save()
    process.exit(0)
  } catch (error) {
    console.log(error)
  }
})()
