module.exports = ({
  fetch = require('../fetch-politely'),
  discourseUrl = require('../discourse-url'),
  junction = require('../junction/bypass')
}) => (badgeId, username) =>
  junction('user-badges-post-response', () =>
    fetch(discourseUrl('/user_badges.json'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        badge_id: badgeId
      })
    }).then(response => response.status)
  ).then(status => {
    if (status /*?*/ !== 200)
      throw new Error('assignBadge endpoint did not respond with 200')
  })
