const factory = require('./factory')

describe('assignBadge', () => {
  it('calls api correctly', () =>
    factory({
      fetch: (url, opts) => {
        expect(url).toBe(someUrl)
        expect(opts.headers['Content-Type']).toBe('application/json')
        expect(opts.body).toBe(
          JSON.stringify({
            username: someUsername,
            badge_id: someBadgeId
          })
        )
        return Promise.resolve({
          status: 200
        })
      },
      discourseUrl: path => {
        expect(path).toBe('/user_badges.json')
        return someUrl
      }
    })(someBadgeId, someUsername).then(result =>
      expect(result).toBe(undefined)
    ))

  it('throws if status is not 200', () =>
    expect(
      factory({
        discourseUrl: () => {},
        fetch: () =>
          Promise.resolve({
            status: 500
          })
      })()
    ).rejects.toThrow('assignBadge endpoint did not respond with 200'))
})
const someUrl = 'x'
const someUsername = 'wafflekins'
const someBadgeId = 123
