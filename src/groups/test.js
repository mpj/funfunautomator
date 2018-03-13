const groups = require('./unbound')

describe('groups', () => {
  it('happy path', () => {
    const process = {
      env: {
        DISCOURSE_BASE_URI: 'https://mydiscourse.com',
        DISCOURSE_API_KEY: 'secrit'
      }
    }
    const fetch = url => {
      expect(url).toBe(
        'https://mydiscourse.com/users/waffleman.json' +
          `?api_username=system&api_key=secrit`
      )
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            user: {
              groups: [{ name: 'group-a' }, { name: 'group-b' }]
            }
          })
      })
    }
    groups({ process, fetch }, 'waffleman').then(result => {
      expect(result[0]).toBe('group-a')
      expect(result[1]).toBe('group-b')
    })
  })
})
