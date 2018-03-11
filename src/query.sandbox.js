const query = require('./query')
const sniff = require('supersniff')

query(3,{
  startdate: '2017-12-01',
  enddate: '2017-12-31'
}).then(sniff)