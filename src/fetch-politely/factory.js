module.exports = ({
  fetch = require('node-fetch'),
  delay = require('delay')
}) =>
  function fetchPolitely(url, opts) {
    //@ts-ignore
    return fetch(url, opts).then(
      response =>
        response.status === 429 // = Too Many Requests
          ? response
              .json()
              .then(body => delay((body.extras.wait_seconds + 1) * 1000))
              .then(() => fetchPolitely(url, opts))
          : response
    )
  }
