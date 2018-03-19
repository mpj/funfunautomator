const R = require('ramda')

const query = ({ fetch, discourseUrl }, id, params) =>
  fetch(discourseUrl(`/admin/plugins/explorer/queries/${id}/run`, {
    limit: 1000000,
    params:
      params &&
      JSON.stringify(R.mapObjIndexed(arg => arg.toString(), params))
  }), { method: 'post' })
  .then(response => response.json())

module.exports = query
