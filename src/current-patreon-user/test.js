const currentPatreonUser = require('./unbound')

describe('currentPatreonUser', () => {
  it('happy path', () =>
  currentPatreonUser({
      fetch: (url, opts) => {
        expect(url).toBe('https://www.patreon.com/api/oauth2/api/current_user')
        expect(opts.headers.Authorization).toBe('Bearer someToken')
        return Promise.resolve({
          json: () => Promise.resolve({
            data: someData
          })
        })
      }
   }, someToken).then(result =>
      expect(result).toBe(someData))
  )
})

const someData = { hey: 1 }
const someToken = 'someToken'

