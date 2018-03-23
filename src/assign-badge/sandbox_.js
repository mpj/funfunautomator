const assignBadge = require('./factory')({
  snapshot: require('../junction/file-cache')('assign-badge')
})

it('assignBadge sandbox', () => assignBadge(106, 'mpj') /*?*/)
