const qs = require('qs')
module.exports = ({
  baseUrl = process.env.DISCOURSE_BASE_URI,
  apiKey = process.env.DISCOURSE_API_KEY
}) => (path, query) =>
  `${baseUrl}${path}?${qs.stringify({
    api_username: 'system',
    api_key: apiKey,
    ...query
  })}`
