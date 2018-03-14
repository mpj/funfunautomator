module.exports = require('./unbound').bind(null, {
  fetch: require('../fetch-politely'),
  discourseUrl: require('../discourse-url')
})
