const factory = require('./factory')
const delay = require('delay')

describe('fetchPolitely', () => {
  it('waits when ratelimited', () => {
    let fetchCalledTimes = 0
    let resolveDelay = () => {
      throw new Error('i should not be called')
    }
    let isResolved = false
    //@ts-ignore
    const responsePromise = factory({
      fetch: (url, opts) => {
        fetchCalledTimes++
        expect(url).toBe(someUrl)
        expect(opts).toBe(someOpts)
        if (fetchCalledTimes === 1)
          return Promise.resolve({
            status: 429,
            json: () =>
              Promise.resolve({
                extras: { wait_seconds: 14 }
              })
          })
        else return Promise.resolve(someResponse)
      },
      delay: ms => {
        expect(ms).toBe((14 + 1) * 1000)
        return new Promise(resolve => {
          // @ts-ignore
          resolveDelay = resolve
        })
      }
    })(someUrl, someOpts).then(response => {
      isResolved = true
      expect(response).toBe(someResponse)
    })

    expect(isResolved).toBe(false)
    return delay(1).then(() => {
      expect(isResolved).toBe(false)
      resolveDelay()
      return delay(1).then(() => {
        expect(isResolved).toBe(true)
        return responsePromise
      })
    })
  })
})

const someUrl = 'http://myurl.com'
const someOpts = { method: 'post' }
const someResponse = {
  status: 200
}
