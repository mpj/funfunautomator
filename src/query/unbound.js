const query = ({ fetch, discourseUrl }, id, params) => {
  const url = discourseUrl(`/admin/plugins/explorer/queries/${id}/run`, {
    limit: 1000000,
    params: JSON.stringify(params)
  })
  return fetch(url, { method: 'post' }).then(response => response.json())
}

module.exports = query
