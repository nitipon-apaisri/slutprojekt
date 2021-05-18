const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const mongod = new MongoMemoryServer()

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

async function connect() {
  const uri = await mongod.getUri()

  return mongoose.connect(uri, options)
}

async function prodConnect() {
  await mongoose.connect(process.env.MONGO_URI, options)
}
module.exports = { connect, prodConnect }
