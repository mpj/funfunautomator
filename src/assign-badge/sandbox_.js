const assignBadge = require('./unbound').bind(null, {
  ...require('./deps'),
  crossroad: require('../crossroad').crossroad
})

it('assignBadge sandbox', () =>
  assignBadge(106, 'mpj')
)

