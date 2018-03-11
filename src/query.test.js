const factory = require('./query.factory')
describe('query', () => {

  let query
  let deps
  beforeEach(() => {
    deps = {
      fetch: null,
      process: {
        env: null
      }
    }
    query = factory(deps)
  })

  it('works in the happy path case', () => {
    deps.process.env = {
      DISCOURSE_BASE_URI: 'https://ourdiscourse.com',
      DISCOURSE_API_KEY: 'secritz'
    }
    deps.fetch = (url, opts) => {
      expect(url).toBe(
        `https://ourdiscourse.com/admin/plugins/explorer/queries/5/run` +
        `?api_username=system&api_key=secritz&limit=1000000`
      )
      expect(opts.method).toBe('post')
      return Promise.resolve({
        json: () => Promise.resolve(someResult)
      })
    }
    return query(5).then(result => expect(result).toBe(someResult))
  })

  it('handles params', () => {
    deps.fetch = (url, opts) => {
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
    }
    deps.process.env = {
      DISCOURSE_BASE_URI: 'https://ourdiscourse.com',
      DISCOURSE_API_KEY: 'secritz'
    }
    return query(8, {
      param1: 'hello',
      param2: 'waht'
    }).then(someResult)

  })
})

const someResult = { a: 'b' }