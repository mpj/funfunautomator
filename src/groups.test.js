const factory = require('./groups.factory')

describe('groups', () => {
  let deps
  let groups
  beforeEach(() => {
    deps = {
      fetch: null,
      process: {
        env: null
      }
    }
    groups = factory(deps)
  })

  it('happy path', () => {
    deps.process.env = {
      DISCOURSE_BASE_URI: 'https://mydiscourse.com',
      DISCOURSE_API_KEY: 'secrit'
    }
    deps.fetch = url => {
      expect(url).toBe(
        'https://mydiscourse.com/users/waffleman.json' +
        `?api_username=system&api_key=secrit`
      )
      return Promise.resolve({
        json: () => Promise.resolve({
          user: {
            groups: [
              { name: 'group-a' },
              { name: 'group-b' }
            ]
          }
        })
      })
    }
    return groups('waffleman')
      .then(result => {
        expect(result[0]).toBe('group-a')
        expect(result[1]).toBe('group-b')
      })
  })
})