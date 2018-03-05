const getQuery = require('./')

getQuery(3,{
  startdate: '2017-12-01',
  enddate: '2017-12-31'
}).then(require('supersniff'))