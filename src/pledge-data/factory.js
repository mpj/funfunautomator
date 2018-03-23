const R = require('ramda')

module.exports = ({
  query = require('../query'),
  junction = require('../junction/bypass')
}) => id =>
  junction('query', () => query(6, { patreonid: id })).then(firstRowAsObject)

const firstRowAsObject = ({ columns, rows }) =>
  rows[0] ? R.zipObj(columns, rows[0]) : null
