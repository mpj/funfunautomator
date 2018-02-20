const fetch = require('node-fetch')

module.exports = require('./get-all-users')({
  fetch,
  process
})