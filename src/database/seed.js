const userModel = require('../models/userModel')
const taskModel = require('../models/taskModel')

const { connect, prodConnect } = require('./connection')

;(async () => {
  if (process.env.NODE_ENV === 'production') {
    await prodConnect()
  } else {
    await connect()
  }
  await seed()
})()

const seed = async () => {
  const userAdmin = await userModel.create({
    username: 'admin',
    password: 'admin',
    role: 'admin'
  })
  await userAdmin.save()

  const userWorker = await userModel.create({
    username: 'worker',
    password: 'worker',
    role: 'worker',
    tasks: []
  })
  await userWorker.save()

  const userClient = await userModel.create({
    username: 'client',
    password: 'client',
    role: 'client',
    tasks: []
  })
  await userClient.save()

  const userClient1 = await userModel.create({
    username: 'client1',
    password: 'client1',
    role: 'client',
    tasks: []
  })
  await userClient1.save()

  const task = await taskModel.create({
    title: 'task',
    info: 'Just do it!',
    client: 'client'
  })
  await task.save()
  userClient.tasks.push(task)
  await userClient.save()

  const task1 = await taskModel.create({
    title: 'task 1',
    info: 'Maybe do it!',
    client: 'client1'
  })
  await task1.save()
  userClient1.tasks.push(task1)
  await userClient1.save()

  userWorker.tasks.push(task, task1)
  await userWorker.save()
}

module.exports = seed
