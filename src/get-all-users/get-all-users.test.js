const getAllUsers = require('./get-all-users')
describe('getAllUsers', () => {
  it('works', () => {
    const deps = {
      fetch: jest.fn(),
      process: {
        env: {
          DISCOURSE_API_KEY: 'secrit'
        }
      }
    }
    deps.fetch.mockReturnValueOnce(Promise.resolve({
      json: () => Promise.resolve([
        { username: 'david' },
        { username: 'mpj' }
      ])
    }))
    return getAllUsers(deps)(1)
      .then(result => {
        expect(deps.fetch).toHaveBeenCalledWith(
          'https://www.funfunforum.com/' +
          'admin/users/list/active.json?api_username=system' +
          '&api_key=secrit&page=1'
        )
        expect(result[0]).toBe('david')
        expect(result[1]).toBe('mpj')
      })



  })
})

