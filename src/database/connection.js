const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const mongod = new MongoMemoryServer()

async function connect() {
  const uri = await mongod.getUri()
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
  return mongoose.connect(uri, options)
}
module.exports = connect
