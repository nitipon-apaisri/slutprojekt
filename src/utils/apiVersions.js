let apiVersionCount = 1

const API_PREFIX = process.env.API_PREFIX.split(';').reduce((acc, curr) => {
  acc[`v${apiVersionCount}`] = curr
  apiVersionCount++
  return acc
}, {})

module.exports = API_PREFIX
