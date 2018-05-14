const badges = require('./unbound').bind(null, {
  ...require('./effectors'),
  memo: require('../junction').file.bind(null, 'badges')
})
describe('badges', () => {
  it('sandbox', () =>
    badges() //?
  )
})