const url = require('url')
const express = require('express')
const bodyParser = require('body-parser')
const WebSocket = require('ws')
const cors = require('cors')
const apicache = require('apicache').middleware
const browserify = require('browserify')
const Raven = require('raven')
const sniff = require('supersniff')
const R = require('ramda')

const querystring = require('querystring')
const fetch = require('node-fetch')

const cookieParser = require('cookie-parser')

const hackableJSON = require('./hackable-json')
const getQuery = require('./query')
const isWebhookRequestValid = require('./is-webhook-request-valid')
const currentPatreonUser = require('./current-patreon-user')
const pledge = require('./pledge')

const app = express()

// Sentry setup
if(!process.env.SENTRY_DSN)
  throw new Error('SENTRY_DSN environment variable missing')
Raven.config(process.env.SENTRY_DSN, {
  release: process.env.RELEASED_REVISION
}).install()
// Raven request (and error) handler must be the first middleware on the app
app.use(Raven.requestHandler())


// pretty hacky solution to get rawbody (so that we can do
// the webhook verification, too tired  to figure better solution out ATM
// From: https://coderwall.com/p/qrjfcw/capture-raw-post-body-in-express-js
function rawBodySaver(req, res, buf, encoding) {
  if (buf && buf.length) req.rawBody = buf.toString(encoding || 'utf8')
}
app.use(bodyParser.json({ verify: rawBodySaver }))
app.use(bodyParser.urlencoded({ extended: false, verify: rawBodySaver }))
app.use(bodyParser.raw({ verify: rawBodySaver, type: function () { return true } }))
app.use(cookieParser('secret123'))
app.use(cors({
  origin: true, // set to whatever request origin is. This is more permissive than * and works with
                // null origin, for example.
  credentials: true
}))

// Hackable JSON cache
let isWarmupTriggered = false
let hackableJSONCache = {}
function ensureWarmup() {
  if (isWarmupTriggered) return
  isWarmupTriggered = true
  hackableJSON()
    .then(response => response.reduce((lookup, user) => ({
      ...lookup,
      ...{ [user.username]: user.hackablejson }
    }), {}))
    .then(cache => {
      hackableJSONCache = cache
    })
}

app.get('/hackablejson', (req, res) => {
  ensureWarmup()
  res.json(hackableJSONCache)
})

app.post('/')

const isDateString = str => str && str.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)
app.get('/dau', apicache('1 hour'), (req, res)  => {
  if (!isDateString(req.query.start))
    return res.status(400).send('start must be in YYYY-MM-DD format')
  if (!isDateString(req.query.end))
    return res.status(400).send('end must be in YYYY-MM-DD format')
  getQuery(3, {
    startdate: req.query.start,
    enddate: req.query.end
  }).then(result => res.json(result.rows))
})

app.get('/wau', apicache('1 hour'), (req, res)  => {
  if (!isDateString(req.query.start))
    return res.status(400).send('start must be in YYYY-MM-DD format')
  if (!isDateString(req.query.end))
    return res.status(400).send('end must be in YYYY-MM-DD format')
  getQuery(4,{
    startdate: req.query.start,
    enddate: req.query.end
  }).then(result => res.json(result.rows))
})

app.get('/mau', apicache('1 hour'), (req, res)  => {
  if (!isDateString(req.query.start))
    return res.status(400).send('start must be in YYYY-MM-DD format')
  if (!isDateString(req.query.end))
    return res.status(400).send('end must be in YYYY-MM-DD format')
  getQuery(5,{
    startdate: req.query.start,
    enddate: req.query.end
  }).then(result => res.json(result.rows))
})

app.get('/cookietest', (req, res) => {
  console.log('req.cookies', req.cookies)
  res.cookie('cookieName', parseInt(req.cookies.cookieName || 0) + 1)
  res.status(200).send('ok')
})

app.post('/webhook', (req, res) => {
  if (!isWebhookRequestValid(req)) {
    res.status(403).send('invalid signature')
    return
  }

  if(req.headers['x-discourse-event'] !== 'user_updated') {
    res.status(200).send('event ignored')
    return
  }

  const HACKABLE_JSON_FIELD_ID = 1

  const username = req.body.user.username
  const hackableJSON = req.body.user.user_fields && req.body.user.user_fields[''+HACKABLE_JSON_FIELD_ID]

  if (!hackableJSON || hackableJSON === '') {
    // don't add this user, they might not want to be public
    res.status(200).send('carry on')
    return
  }

  hackableJSONCache[username] = hackableJSON
  res.status(200).send('cache updated')
  sendToAll(JSON.stringify({ username, hackableJSON }))
})

app.get('/fail', (req, res) => {
  throw new Error('blam')
})

app.get('/bundle', (req, res) => {

  browserify('./bundle.js', {standalone: 'date-info'})
    .transform('babelify', {presets: [ 'es2017' ]})
    .bundle()
    .pipe(res)
})



app.get('/login', function(req, res) {
  res.redirect('https://www.patreon.com/oauth2/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.PATREON_CLIENT_ID,
      redirect_uri: process.env.PATREON_REDIRECT_URI,
    }))
})

app.get('/badge-app', function(req, res) {
  res.sendFile(__dirname + '/gui.html')
})

app.post('/award-badge',  async function(req, res) {
  const { token, badge } = req.body
  const patreonUser = await currentPatreonUser(token)
  const patronid = 7357096 || parseInt(patreonUser.id)
  const currentPledge = await pledge(patronid)
  if (currentPledge < 500) {
    return res.status(403).send(
      'Need to pledge at least 500 cents to award badge')
  }

    console.log('currentPledge', currentPledge)
})

app.post('/patreon_token', function(req, res) {
  const code = url.parse(req.url, true).query.code
  //@ts-ignore
  fetch(
    'https://www.patreon.com/api/oauth2/token?' +
    querystring.stringify({
      code,
      grant_type: 'authorization_code',
      client_id: process.env.PATREON_CLIENT_ID,
      client_secret: process.env.PATREON_CLIENT_SECRET,
      redirect_uri: process.env.PATREON_REDIRECT_URI
    }), { method: 'post' })
  .then(response => response.json())
  .then(sniff)
  .then(R.pick([ 'access_token', 'expires_in' ]))
  .then(cleanedResult => res.json(cleanedResult))
})

const server = require('http').createServer(app)
const wss = new WebSocket.Server({ server })

const sockets = []
wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true)
  if (location.path === '/hackablejson') {
    sockets.push(ws)
  }
  ws.on('error', () => {})
})

function sendToAll(msg) {
  sockets.slice().forEach(socket => {
    try {
      socket.send(msg)
    } catch (err) {
      sockets.splice(sockets.indexOf(socket), 1)
      socket.terminate()
    }
  })
}
// Raven error handler must be before all other error handlers
// but after request handlers
app.use(Raven.errorHandler())

setInterval(() => sendToAll('ping'), 5000)

const port = process.env.PORT || 3001
server.listen(port, () => {
  console.log('listening on port', port)
})
