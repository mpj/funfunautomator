const HACKABLE_JSON_QUERY_ID = 1
const hackableJSON = deps => () =>
  deps.query(HACKABLE_JSON_QUERY_ID)
    .then(result => result.rows.map(row => ({ username: row[0], hackablejson: row[1] })))

module.exports = hackableJSON