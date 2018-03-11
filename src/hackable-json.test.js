const factory = require('./hackable-json.factory')

describe('hackableJSON', () => {
  let deps
  let hackableJSON
  beforeEach(() => {
    deps = {
      query: null
    }
    hackableJSON = factory(deps)
  })

  it('happy path', () => {
    deps.query = id => {
      expect(id).toBe(1)
      return Promise.resolve({
        rows: [
          [ 'someusername', 'somestring' ],
          [ 'someotherusername', 'someotherstring' ]
        ]
      })
    }
    return hackableJSON()
      .then(result => {
        expect(result[0].username).toBe('someusername')
        expect(result[1].hackablejson).toBe('someotherstring')
      })
  })
})