const pledgeData = require('./unbound').bind(null, {
  ...require('./effectors'),
  memo: require('../junction').file.bind(null, 'pledge-data')
})

it('pledgeData sandbox', () =>
  pledgeData(10200657)/*?*/
)
