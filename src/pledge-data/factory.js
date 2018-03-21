const R = require('ramda')
module.exports = ({
  query = require('../query'),
  memo = require('../memo')()
}) => id =>
  memo('query', () => query(6, { patreonid: id })).then(firstRowAsObject)

const firstRowAsObject = ({ columns, rows }) =>
  rows[0] ? R.zipObj(columns, rows[0]) : null
