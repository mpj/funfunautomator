const { filter, pick, map } = require('ramda')

module.exports = async ({
  badges,
  teamBadgeGroupId
}) =>
  badges()
    .then(filter(x => x.badge_grouping_id === teamBadgeGroupId))
    .then(map(pick([
      'id',
      'name',
      'description',
      'slug',
      'image',
      'enabled'
    ])))
