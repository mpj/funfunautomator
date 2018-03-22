const factory = require('./factory')
const makeSnapshot = require('../junction')
const snapshot = makeSnapshot({ dir: 'pledge-data' })

it('pledgeData sandbox', () =>
  snapshot(
    'output',
    () =>
      factory({
        snapshot
      })(10200657) /*?*/
  ))
