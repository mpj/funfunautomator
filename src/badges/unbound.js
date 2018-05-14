module.exports = (
  { discourseUrl, fetch }
) =>
  fetch(discourseUrl('/admin/badges.json'))
    .then(r => r.json())
    .then(body => body.badges)
