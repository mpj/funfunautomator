const factory = require('./factory')

describe('pledgeData', () => {
  it('sandbox', () =>
    factory({
      memo: require('../memo')('pledge-data')
    })(10200657)/*?*/
  )
})