const R = require('ramda')
const makeSnapshot = require('../junction')

module.exports = ({
  query = require('../query'),
  snapshot = makeSnapshot({ bypass: true })
}) => id =>
  snapshot('query', () => query(6, { patreonid: id })).then(firstRowAsObject)

const firstRowAsObject = ({ columns, rows }) =>
  rows[0] ? R.zipObj(columns, rows[0]) : null
