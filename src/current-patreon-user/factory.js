module.exports = ({
  fetch = require('node-fetch'),
  junction = require('../junction/bypass')
}) => token =>
  junction('fetch-body', () =>
    //@ts-ignore
    fetch('https://www.patreon.com/api/oauth2/api/current_user', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(x => x.json())
  ).then(result => result.data)
