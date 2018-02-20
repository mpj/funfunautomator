const getGroups = require('./get-groups')
describe('getGroups', () => {
  it('happy path', () => {
    const deps = {
      fetch: jest.fn(),
      process: {
        env: {
          DISCOURSE_BASE_URI: 'https://mydiscourse.com',
          DISCOURSE_API_KEY: 'secrit'
        }
      }
    }
    deps.fetch.mockReturnValueOnce(Promise.resolve({
      json: () => Promise.resolve({
        user: {
          groups: [
            { name: 'group-a' },
            { name: 'group-b' }
          ]
        }
      })
    }))
    return getGroups(deps)('waffleman')
      .then(result => {
        expect(result[0]).toBe('group-a')
        expect(result[1]).toBe('group-b')
      })
  })
})