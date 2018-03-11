const fetch = require('node-fetch')

module.exports = require('./groups.factory')({
  fetch,
  process
})