const badges = require('../badges')
module.exports = require('./unbound').bind(null, {
  teamBadgeGroupId: 6,
  badges
})