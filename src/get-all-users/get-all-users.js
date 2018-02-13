module.exports = ({
  fetch,
  process
}) => page =>
  fetch(
    'https://www.funfunforum.com/' +
    'admin/users/list/active.json?api_username=system' +
    `&api_key=${process.env.DISCOURSE_API_KEY}&page=${page}`
  )
  .then(response => response.json())
  .then(users => users.map(user => user.username))