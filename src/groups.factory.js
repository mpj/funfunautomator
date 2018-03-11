module.exports = deps => username =>
  deps.fetch(
    `${deps.process.env.DISCOURSE_BASE_URI}/users/${username}.json` +
    `?api_username=system&api_key=${deps.process.env.DISCOURSE_API_KEY}`
  )
  .then(response => response.json())
  .then(body => body.user.groups.map(group => group.name))