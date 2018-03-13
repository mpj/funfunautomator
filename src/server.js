const url = require('url')
const express = require('express')
const bodyParser = require('body-parser')
const WebSocket = require('ws')
const cors = require('cors')
const apicache = require('apicache').middleware
const browserify = require('browserify')

const cookieParser = require('cookie-parser')

const hackableJSON = require('./hackable-json')
const getQuery = require('./query')
const isWebhookRequestValid = require('./is-webhook-request-valid')

const app = express()

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
  origin: function (origin, callback) {
    callback(null, true)
  },
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

const isStringDate = str => str.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)
app.get('/dau', apicache('1 hour'), (req, res)  => {
  if (!isStringDate(req.query.start))
    return res.status(400).send('start must be in YYYY-MM-DD format')
  if (!isStringDate(req.query.end))
    return res.status(400).send('end must be in YYYY-MM-DD format')
  getQuery(3, {
    startdate: req.query.start,
    enddate: req.query.end
  }).then(result => res.json(result.rows))
})

app.get('/wau', apicache('1 hour'), (req, res)  => {
  if (!isStringDate(req.query.start))
    return res.status(400).send('start must be in YYYY-MM-DD format')
  if (!isStringDate(req.query.end))
    return res.status(400).send('end must be in YYYY-MM-DD format')
  getQuery(4,{
    startdate: req.query.start,
    enddate: req.query.end
  }).then(result => res.json(result.rows))
})

app.get('/mau', apicache('1 hour'), (req, res)  => {
  res.cookie('cookieName', parseInt(req.cookies.cookieName) + 1)
  if (!isStringDate(req.query.start))
    return res.status(400).send('start must be in YYYY-MM-DD format')
  if (!isStringDate(req.query.end))
    return res.status(400).send('end must be in YYYY-MM-DD format')
  getQuery(5,{
    startdate: req.query.start,
    enddate: req.query.end
  }).then(result => res.json(result.rows))
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

app.get('/bundle', (req, res) => {

  browserify('./bundle.js', {standalone: 'date-info'})
    .transform('babelify', {presets: [ 'es2017' ]})
    .bundle()
    .pipe(res)
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

setInterval(() => sendToAll('ping'), 5000)

const port = process.env.PORT || 3001
server.listen(port, () => {
  console.log('listening on port', port)
})
