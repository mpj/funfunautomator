module.exports = function fetchPolitely({ fetch, delay }, url, opts) {
  return fetch(url, opts).then(
    response =>
      response.status === 429 // = Too Many Requests
        ? response
            .json()
            .then(body => delay((body.extras.wait_seconds + 1) * 1000))
            .then(() => fetchPolitely({ fetch, delay }, url, opts))
        : response
  )
}
