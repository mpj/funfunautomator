const pledge = require('./unbound').bind(null, {
  ...require('./effectors'),
  memo: require('../junction').file.bind(null, 'pledge')
})

it('pledge sandbox', () =>
  pledge(7357096)/*?*/
)


