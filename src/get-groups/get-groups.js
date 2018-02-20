module.exports = ({
  process,
  fetch
}) => username =>
  fetch(
    `${process.env.DISCOURSE_BASE_URI}/users/${username}.json` +
    `?api_username=system&api_key=${process.env.DISCOURSE_API_KEY}`
  )
  .then(response => response.json())
  .then(body => body.user.groups.map(group => group.name))