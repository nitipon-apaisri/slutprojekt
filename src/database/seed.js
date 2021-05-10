const userModel = require('../models/userModel')
const taskModel = require('../models/Task')

const seed = async () => {
  try {
    const task = await taskModel.create({
      title: 'first-task',
      info: 'task fro company x',
      client: userClient.username,
      messages: []
    })
    await task.save()

    const userAdmin = await userModel.create({
      username: 'admin',
      password: 'admin',
      role: 'admin'
    })

    await userAdmin.save()
    const userWorker = await userModel.create({
      username: 'worker',
      password: 'worker',
      tasks: [task]
    })
    await userWorker.save()
    const userClient = await userModel.create({
      username: 'client',
      password: 'client',
      role: 'client',
      tasks: [task]
    })

    await userClient.save()
  } catch (error) {
    console.log(error.message)
  }
}
module.exports = seed
