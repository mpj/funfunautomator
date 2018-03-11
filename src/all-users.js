const fetch = require('node-fetch')

module.exports = require('./all-users.factory')({
  fetch,
  process
})