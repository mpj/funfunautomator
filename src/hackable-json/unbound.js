module.exports = ({ query }) =>
  query(1).then(result => result.rows.map(
    row => ({ username: row[0], hackablejson: row[1] })))