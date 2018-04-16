const assignBadge = require('./factory')({
  junction: require('../junction/file-cache')('assign-badge')
})

it('assignBadge sandbox', () => assignBadge(106, 'mpj') /*?*/)
