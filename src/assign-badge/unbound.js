module.exports = function assignBadge(
  { discourseUrl, fetch },
  badgeId,
  username
) {
  return fetch(discourseUrl('/user_badges.json'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      badge_id: badgeId
    })
  }).then(response => {
    if (response.status !== 200)
      throw new Error('assignBadge endpoint did not respond with 200')
  })
}
