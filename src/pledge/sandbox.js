const pledge = require('./')

const sniff = require('supersniff')

pledge(7357096).then(sniff)
