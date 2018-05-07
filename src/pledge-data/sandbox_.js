const factory = require('./factory')
const makeFileCacheJunction = require('../junction/file-cache')
const junction = makeFileCacheJunction('pledge-data')

it('pledgeData sandbox', () =>
  junction(
    'output',
    () =>
      factory({
        junction
      })(10200657) /*?*/
  ))
