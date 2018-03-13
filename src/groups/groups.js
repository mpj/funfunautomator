const fetch = require('node-fetch')

module.exports = require('./unbound').bind(null, {
  fetch,
  process
})