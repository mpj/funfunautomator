const express = require('express')
const cache = require('apicache').middleware
const getHackableJSON = require('./src/get-hackable-json')
const app = express()

const isWebhookRequestValid = require('./src/is-webhook-request-valid')

let hackableJSONPromise
function ensureHackableJSON() {
  if (hackableJSONPromise) return
  hackableJSONPromise = getHackableJSON()
    .then(response =>
      response.reduce((lookup, user) => ({
        ...lookup,
        ...{ [user.username] : user.hackablejson }
      }), {}))
    .then(cache => {
      hackableJSONCache = cache
    })
  return hackableJSONPromise
}

let hackableJSONCache = {}

app.get('/hackablejson', (req, res) => {
  ensureHackableJSON()
  res.json(hackableJSONCache)
})

app.post('/webhook', (req, res) => {
  if (!isRequestValid(req)) {
    res.status(403).send('invalid signature')
    return
  }

  if(req.headers['x-discourse-event'] === 'user_updated') {

    let hackableDataCache = state.cache.result.data
    if (!hackableDataCache) {
      res.status(200).send('carry on')
    } else {
      const HACKABLE_JSON_FIELD_ID = 1

      const snapshot = {
        username: req.body.user.username,
        hackablejson:
          userSnapshot.user_fields &&
          userSnapshot.user_fields[''+HACKABLE_JSON_FIELD_ID]
      }

      if (!snapshot.hackablejson) {
        // don't add this user, they might not want to be public
        res.status(200).send('carry on')
        return
      }

      hackableJSONCache[snapshot.username] = snapshot.hackablejson
      res.status(200).send('cache updated')
    }
  } else {
    res.status(200).send('event ignored')
  }

})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('listening on port', port)
})
