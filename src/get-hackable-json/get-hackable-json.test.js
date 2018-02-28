const getHackableJSON = require('./get-hackable-json')

describe('getHackableJSON', () => {
  it('happy path', () => {
    const someResult = { a: 'b' }
    const deps = {
      getQuery: (id) => {
        expect(id).toBe(1)
        return Promise.resolve({
          rows: [
            [ 'someusername', 'somestring' ],
            [ 'someotherusername', 'someotherstring' ]
          ]
        })
      }
    }
    return getHackableJSON(deps)()
      .then(result => {
        expect(result[0].username).toBe('someusername')
        expect(result[1].hackablejson).toBe('someotherstring')
      })
  })
})