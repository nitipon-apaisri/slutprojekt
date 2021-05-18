const express = require('express')
const cors = require('cors')
const seed = require('./database/seed')
const errorHandler = require('./middlewares/errorHandler')
const loggerMiddleware = require('./middlewares/logger')

const routes = require('./routes')
const connect = require('./database/connection')

const API_PREFIX = require('./utils/apiVersions')

const corsOptions = require('./utils/cors')

const PORT = process.env.PORT || 3000
const app = express()

if (process.env.NODE_ENV === 'dev') {
  app.use(loggerMiddleware)
}
app.use(cors(corsOptions))
app.use('/static', express.static('public'))
app.use(express.json())
app.use(API_PREFIX['v1'], routes.genericRoutes)
app.use(API_PREFIX['v1'], routes.usersRoutes)
app.use(API_PREFIX['v1'], routes.taskRoutes)

app.use(errorHandler)
;(async () => {
  if (process.env.NODE_ENV !== 'prod') {
    await connect.connect()
  } else {
    await connect.prodConnect()
  }
  console.log('Connected to database.')
  await seed()
  app.listen(PORT, () => console.log('Server running on port ' + PORT))
})()
