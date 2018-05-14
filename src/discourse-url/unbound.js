const qs = require('qs')
module.exports = (baseUrl, apiKey, path, query) =>
  `${baseUrl}${path}?${qs.stringify(Object.assign({}, {
    api_username: 'system',
    api_key: apiKey
  }, query))}`
