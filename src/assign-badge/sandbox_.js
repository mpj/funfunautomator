const assignBadge = require('./factory')({
  snapshot: require('../junction')({ dir: 'assign-badge' })
})

it('assignBadge sandbox', () => assignBadge(106, 'mpj') /*?*/)
