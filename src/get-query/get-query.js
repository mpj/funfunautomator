const getQuery = ({
  fetch,
  process
}) => id => {
  const url =
    `${process.env.DISCOURSE_BASE_URI}/admin/plugins/explorer/queries/${id}/run` +
    `?api_username=system&api_key=${process.env.DISCOURSE_API_KEY}&limit=1000000`
  return fetch(url, { method: 'post' })
    .then(response => response.json())
}

module.exports = getQuery

