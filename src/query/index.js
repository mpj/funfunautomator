const fetch = require('node-fetch')
const discourseUrl = require('../discourse-url')

module.exports = require('./unbound').bind(null, {
  fetch,
  discourseUrl
})
