const getQuery = require('./get-query')
describe('getQuery', () => {

  const someResult = { a: 'b' }

  it('happy path', () => {

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

  it('handles params', () => {
    const deps = {
      fetch: (url, opts) => {
        expect(url).toBe(
          `https://ourdiscourse.com/admin/plugins/explorer/queries/8/run` +
          `?api_username=system&api_key=secritz&limit=1000000&params=${JSON.stringify({
            param1: 'hello',
            param2: 'waht'
          })}`
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
    return getQuery(deps)(8, {
      param1: 'hello',
      param2: 'waht'
    }).then(someResult)

  })
})