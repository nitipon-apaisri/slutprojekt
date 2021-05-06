const express = require('express')
const errorHandler = require('./middlewares/errorHandler')
const app = express()

const loggerMiddleware = require('./middlewares/logger')

const PORT = process.env.PORT || 3000

app.use(express.json())

if (process.env.NODE_ENV === 'dev') {
  app.use(loggerMiddleware)
}

app.get('/', (req, res, next) => {
  res.json({ message: 'welcome' })
})

app.use(errorHandler)
app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`)
})
