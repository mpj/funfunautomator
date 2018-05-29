const query = require('./unbound')
describe('query', () => {
  it('works in the happy path case', () =>
    query(
      {
        discourseUrl: (path, params) => {
          expect(path).toBe('/admin/plugins/explorer/queries/5/run')
          expect(params).toEqual({
            limit: 1000000
          })
          return 'someUrl'
        },
        fetch: (url, opts) => {
          expect(url).toBe('someUrl')
          expect(opts.method).toBe('post')
          return Promise.resolve({
            json: () => Promise.resolve(someResult)
          })
        }
      },
      5
    ).then(result => expect(result).toBe(someResult)))

  it('handles params', () =>
    query(
      {
        discourseUrl: (path, params) => {
          expect(path).toBe('/admin/plugins/explorer/queries/8/run')
          expect(params).toEqual({
            limit: 1000000,
            params: JSON.stringify(someParams)
          })
          return 'someOtherUrl'
        },
        fetch: (url, opts) => {
          expect(url).toBe('someOtherUrl')
          expect(opts.method).toBe('post')
          return Promise.resolve({
            json: () => Promise.resolve(someResult)
          })
        }
      },
      8,
      someParams
    ).then(result => expect(result).toBe(someResult)))

  it('coerces ints to string', () => {
    query(
      {
        fetch: (url, opts) => {
          return Promise.resolve({
            json: () => Promise.resolve(someResult)
          })
        },
        discourseUrl: (path, params) => {
          expect(params).toEqual({
            limit: 1000000,
            params: JSON.stringify({ numparam: '8' })
          })
          return 'someOtherUrl'
        }
      },
      1,
      {
        numparam: 8
      }
    )
  })
})

const someParams = {
  param1: 'hello',
  param2: 'waht'
}

const someResult = { a: 'b' }
