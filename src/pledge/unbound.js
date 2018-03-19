const R = require('ramda')
module.exports = ({ query }, id) =>
  query(6, { patreonid: id })
    .then(firstRowAsObject)
    .then(x => x.pledge_cents)
    .then(parseInt)

const firstRowAsObject = ({ columns, rows }) => R.zipObj(columns, rows[0])
