const allUsers = require('./factory')({
  junction: require('../junction/file-cache')('all-users')
})
it('allUsers (sandbox)', () =>
  allUsers() /*?*/
)