const hackableJSON = require('./hackable-json')
const sniff = require('supersniff')
hackableJSON()
  .then(console.log)