const query = deps => (id, params) => {
  const url =
    `${deps.process.env.DISCOURSE_BASE_URI}/admin/plugins/explorer/queries/${id}/run` +
    `?api_username=system&api_key=${deps.process.env.DISCOURSE_API_KEY}&limit=1000000` +
    (params ? `&params=${JSON.stringify(params)}` : '')
  return deps.fetch(url, { method: 'post' })
    .then(response => response.json())
}

module.exports = query

