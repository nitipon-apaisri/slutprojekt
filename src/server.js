const express = require('express')
const errorHandler = require('./middlewares/errorHandler')
const connect = require('./database/connection')
const app = express()
const router = require('./routes/index')
const loggerMiddleware = require('./middlewares/logger')
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(router)

if (process.env.NODE_ENV === 'dev') {
  app.use(loggerMiddleware)
}
async function run() {
  await connect()
  console.log('Connected to database.')
  app.listen(PORT, () => console.log('Server running on port ' + PORT))
}
app.use(errorHandler)
run()
