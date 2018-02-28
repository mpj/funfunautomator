const express = require('express')
const cache = require('apicache').middleware
const getHackableJSON = require('./src/get-hackable-json')
const bodyParser = require('body-parser')


const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const cors = require('cors')

 // pretty hacky solution to get rawbody, too tired
// to figure better solution out
// From: https://coderwall.com/p/qrjfcw/capture-raw-post-body-in-express-js
let rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}
app.use(bodyParser.json({ verify: rawBodySaver }))
app.use(bodyParser.urlencoded({ extended: false, verify: rawBodySaver }))
app.use(bodyParser.raw({ verify: rawBodySaver, type: function () { return true } }))

app.use(cors())

const isWebhookRequestValid = require('./src/is-webhook-request-valid')

let isWarmupTriggered = false
let hackableJSONCache = {}
function ensureWarmup() {
  if (isWarmupTriggered) return
  isWarmupTriggered = true
  getHackableJSON()
    .then(response => response.reduce((lookup, user) => ({
      ...lookup,
      ...{ [user.username] : user.hackablejson }
    }), {}))
    .then(cache => {
      hackableJSONCache = cache
    })
}

app.get('/hackablejson', (req, res) => {
  ensureWarmup()
  res.json(hackableJSONCache)
})

app.post('/webhook', (req, res) => {
  if (!isWebhookRequestValid(req)) {
    res.status(403).send('invalid signature')
    return
  }

  if(req.headers['x-discourse-event'] === 'user_updated') {

      const HACKABLE_JSON_FIELD_ID = 1

      const snapshot = {
        username: req.body.user.username,
        hackablejson:
          req.body.user.user_fields &&
          req.body.user.user_fields[''+HACKABLE_JSON_FIELD_ID]
      }

      if (!snapshot.hackablejson) {
        // don't add this user, they might not want to be public
        res.status(200).send('carry on')
        return
      }

      hackableJSONCache[snapshot.username] = snapshot.hackablejson
      res.status(200).send('cache updated')
      io.emit('user-updated', snapshot)
      return

  } else {
    res.status(200).send('event ignored')
  }

})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('listening on port', port)
})
