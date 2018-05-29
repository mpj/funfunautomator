module.exports = require('./unbound').bind(null, {
  fetch: require('node-fetch')
})
