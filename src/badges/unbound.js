module.exports = (
  { discourseUrl, fetch, memo }
) => memo('fetch', () =>
    fetch(discourseUrl('/admin/badges.json')).then(r => r.json())
  ).then(body => body.badges)