const allUsers = require('./unbound')

describe('allUsers', () => {
  it('works', () => allUsers({
    fetch: url => {
      expect(url).toBe(
        'https://mydiscourse.com' +
        '/admin/users/list/active.json?api_username=system' +
        '&api_key=secrit&page=1'
      )
      return Promise.resolve({
        json: () => Promise.resolve([
          { username: 'david' },
          { username: 'mpj' }
        ])
      })
    },
    process: {
      env: {
        DISCOURSE_BASE_URI: 'https://mydiscourse.com',
        DISCOURSE_API_KEY: 'secrit'
      }
    }
  }, 1).then(result => {
    expect(result[0]).toBe('david')
    expect(result[1]).toBe('mpj')
  }))
})

