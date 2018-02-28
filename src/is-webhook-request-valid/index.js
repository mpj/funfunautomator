
const crypto = require('crypto')

function isWebhookRequestValid(request) {
  let hmac = crypto.createHmac('sha256', process.env.DISCOURSE_WEBHOOK_SECRET)
  let hash = `sha256=${hmac.update(request.rawBody).digest('hex')}`
  return hash === request.headers['x-discourse-event-signature']
}

module.exports = isWebhookRequestValid