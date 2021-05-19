const express = require('express')
const cors = require('cors')
const seed = require('./database/seed')
const prodSeed = require('./database/prodSeed')
const errorHandler = require('./middlewares/errorHandler')
const loggerMiddleware = require('./middlewares/logger')

const routes = require('./routes')
const connect = require('./database/connection')

const corsOptions = require('./utils/cors')

const PORT = process.env.PORT || 3000
const app = express()

if (process.env.NODE_ENV === 'dev') {
  app.use(loggerMiddleware)
}
app.use(cors(corsOptions))
app.use('/static', express.static('public'))
app.use(express.json())

app.use('/api/v1', routes.genericRoutes)
app.use('/api/v1', routes.usersRoutes)
app.use('/api/v1', routes.taskRoutes)

app.use(errorHandler)
;(async () => {
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'testing'
  ) {
    await connect.prodConnect()
  } else {
    await connect.connect()
    await seed()
  }
  console.log('Connected to database.')
  app.listen(PORT, () => console.log('Server running on port ' + PORT))
})()
