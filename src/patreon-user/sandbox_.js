const patreonUser = require('./unbound').bind(null, {
  ...require('./effectors'),
  memo: require('../junction').file.bind(null, 'patreon-user')
})

it('patreonUser sandbox', () =>
  patreonUser(7357096)/*?*/
)
