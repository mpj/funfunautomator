module.exports = require('./unbound').bind(null, {
  fetch: require('node-fetch'),
  discourseUrl: require('../discourse-url')
})
