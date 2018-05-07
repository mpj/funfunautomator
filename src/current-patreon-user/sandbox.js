const currentPatreonUser = require('./factory')({
  junction: require('../junction/file-cache')('current-patreon-user')
})

it('currentPatreonUser (Sandbox)', () =>
  currentPatreonUser('eipkPBbTyWt4OYD9mgNky9RqMLuSs8Z5aRzrfKwAN9Q') /*?*/)
