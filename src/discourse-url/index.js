module.exports = require('./unbound').bind(null,
  process.env.DISCOURSE_BASE_URI,
  process.env.DISCOURSE_API_KEY
)
