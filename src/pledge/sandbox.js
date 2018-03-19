const pledge = require('./')

const sniff = require('supersniff')

pledge(6, 271).then(sniff)
