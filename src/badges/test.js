const badges = require('./unbound')

describe('badges', () => {
  it('happy path', () =>
    badges(
      {
        discourseUrl: path => {
          expect(path).toBe('/admin/badges.json')
          return someUrl
        },
        fetch: async url => {
          expect(url).toBe(someUrl)
          return {
            json: async () => ({
              badges: someBadges
            })
          }
        },
        memo: require('../junction').none
      }
    ).then(result => expect(result).toBe(someBadges)))
})

const someUrl = Symbol('someUrl')
const someBadges = Symbol('someBadges')
