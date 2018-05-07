const factory = require('./factory')

describe('hackableJSON', () => {
  it('happy path', () =>
    factory({
      query: id => {
        expect(id).toBe(1)
        return Promise.resolve({
          rows: [
            ['someusername', 'somestring'],
            ['someotherusername', 'someotherstring']
          ]
        })
      }
    })().then(result => {
      expect(result[0].username).toBe('someusername')
      expect(result[1].hackablejson).toBe('someotherstring')
    }))
})
