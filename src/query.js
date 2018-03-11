const fetch = require('node-fetch')

module.exports = require('./query.factory')({
  fetch,
  process
})