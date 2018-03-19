module.exports = ({ fetch }, token) =>
  // @ts-ignore
  fetch('https://www.patreon.com/api/oauth2/api/current_user', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
  .then(x => x.json())
  .then(result => result.data)
