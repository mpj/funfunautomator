const query = require('./unbound')
describe('query', () => {

  it('works in the happy path case', () => query({
    process: correctProcess,
    fetch: (url, opts) => {
      expect(url).toBe(
        `https://ourdiscourse.com/admin/plugins/explorer/queries/5/run` +
        `?api_username=system&api_key=${correctProcess.env.DISCOURSE_API_KEY}&limit=1000000`)
      expect(opts.method).toBe('post')
      return Promise.resolve({
        json: () => Promise.resolve(someResult)
      })
    }
  }, 5).then(result => expect(result).toBe(someResult)))

  it('handles params', () => query({
      process: correctProcess,
      fetch: (url, opts) => {
        expect(url).toBe(
          `https://ourdiscourse.com/admin/plugins/explorer/queries/8/run` +
          '?api_username=system&api_key=secritz&limit=1000000&params='+ JSON.stringify({
            param1: 'hello',
            param2: 'waht'
          })
        )
        expect(opts.method).toBe('post')
        return Promise.resolve({
          json: () => Promise.resolve(someResult)
        })
      },
    },
    8,
    {
      param1: 'hello',
      param2: 'waht'
    }).then(result => expect(result).toBe(someResult)))
})

const correctProcess = {
  env: {
    DISCOURSE_BASE_URI: 'https://ourdiscourse.com',
    DISCOURSE_API_KEY: 'secritz'
  }
}
const someResult = { a: 'b' }