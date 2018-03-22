const R = require('ramda')

module.exports = ({
  fetch = require('../fetch-politely'),
  discourseUrl = require('../discourse-url'),
  snapshot = require('../junction')({ bypass: true })
}) => (badgeId, username) =>
  snapshot('user-badges-post-response', () =>
    fetch(discourseUrl('/user_badges.json'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        badge_id: badgeId
      })
    }).then(R.pick(['status']))
  ).then(response => {
    if (response.status !== 200)
      throw new Error('assignBadge endpoint did not respond with 200')
  })
