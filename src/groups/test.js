const groups = require('./unbound')

describe('groups', () => {
  it('happy path', () =>
    groups({
      discourseUrl: path => {
        expect(path).toBe('/users/waffleman.json')
        return someUrl
      },
      fetch: url => {
        expect(url).toBe(someUrl)
        return Promise.resolve({
          json: () => Promise.resolve({
            user: {
              groups: [{ name: 'group-a' }, { name: 'group-b' }]
            }
          })
        })
      }
   }, 'waffleman').then(result => {
      expect(result[0].name).toBe('group-a')
      expect(result[1].name).toBe('group-b')
    })
  )
})

const someUrl = 'someUrl'
