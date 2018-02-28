const getQuery = require('./get-query')
describe('getQuery', () => {
  it('happy path', () => {
    const someResult = { a: 'b' }
    const deps = {
      fetch: (url, opts) => {
        expect(url).toBe(
          `https://ourdiscourse.com/admin/plugins/explorer/queries/5/run` +
          `?api_username=system&api_key=secritz&limit=1000000`
        )
        expect(opts.method).toBe('post')
        return Promise.resolve({
          json: () => Promise.resolve(someResult)
        })
      },
      process: {
        env: {
          DISCOURSE_BASE_URI: 'https://ourdiscourse.com',
          DISCOURSE_API_KEY: 'secritz'
        }
      }
    }
    return getQuery(deps)(5)
      .then(result =>
        expect(result).toBe(someResult))
  })
})