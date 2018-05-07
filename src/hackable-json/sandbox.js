const hackableJSON = require('./factory')({
  junction: require('../junction/file-cache')('hackable-json')
})
it('hackableJSON (Sandbox)', () => hackableJSON()) //?
