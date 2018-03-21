const assignBadge = require('./unbound').bind(null, {
  ...require('./deps'),
  memo: require('../junction').file.bind(null, 'assign-badge')
})

it('assignBadge sandbox', () =>
  assignBadge(106, 'mpj')
)

