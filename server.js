const express = require('express')
const cache = require('apicache').middleware
const getHackableJSON = require('./src/get-hackable-json')
const app = express()

app.get('/hackablejson', cache('5 minutes'), (req, res) =>
  getHackableJSON().then(res.json.bind(res)))

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('listening on port', port)
})