module.exports = ({
  query = require('../query'),
  junction = require('../junction/bypass')
}) => () =>
  junction('query', () => query(1)).then(result =>
    result.rows.map(row => ({ username: row[0], hackablejson: row[1] }))
  )
