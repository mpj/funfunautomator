const currentPatreonUser = require('./factory')({
  junction: require('../junction/file-cache')('current-patreon-user')
})

it('currentPatreonUser (Sandbox)', () =>
  currentPatreonUser('3-Z4vPfE-BlECBXppvI8lwDZrbYWE4QhUWVjni5fp8o') /*?*/)
