module.exports = ({
  fetch = require('node-fetch').default,
  junction = require('../junction/bypass')
}) => token =>
  junction('fetch-body', () =>
    fetch('https://www.patreon.com/api/oauth2/api/current_user', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(x => x.json())
  ).then(result => result.data)
