const fetchPolitely = require('./unbound')

describe('fetchPolitely', () => {
  it('waits when ratelimited', () => {
    let fetchCalledTimes = 0
    return fetchPolitely({
      fetch: (url, opts) => {
        fetchCalledTimes++
        expect(url).toBe(someUrl)
        expect(opts).toBe(someOpts)
        if (fetchCalledTimes === 1)
          return Promise.resolve({
            status: 429,
            json: () => Promise.resolve({
              extras: { wait_seconds: 14 }
            })
          })
        else
          return Promise.resolve(someResponse)
      },
      delay: ms => {
        expect(ms).toBe((14 + 1) * 1000)
        Promise.resolve()
      }
    }, someUrl, someOpts).then(response =>
      expect(response).toBe(someResponse)
    )
  })
})

const someUrl = 'http://myurl.com'
const someOpts = { method: 'post' }
let someResponse = {
  status: 200,
}
