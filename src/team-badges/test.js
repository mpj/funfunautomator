const unbound = require('./unbound')
describe('badgeTest', () => {
  describe('given badges returns unrelated groups', () => {
    let result
    beforeEach(async () => {
      result = await unbound({
        badges: async () => [
          {
            id: 107,
            badge_grouping_id: someGroupId
          },
          {
            id: 108,
            badge_grouping_id: someOtherGroupId
          },
          {
            id: 109,
            badge_grouping_id: someGroupId
          }
        ],
        teamBadgeGroupId: someGroupId
      })
    })

    it('filters out badges with correct id', async () => {
      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(107)
      expect(result[1].id).toBe(109)
    })
  })

  describe('given result with properties', () => {
    let result
    let someBadge
    beforeEach(async () => {
      someBadge = {
        id: 107,
        name: 'Team Visual Studio Code',
        description: 'This is some badge',
        image:
          'https://www.funfunforum.com/uploads/funfunforum/original/2X/a/a0ec690519e29be286f35fb495b4555cd47426db.png',
        enabled: true,
        slug: 'team-visual-studio-code',
        badge_grouping_id: someGroupId,
        manually_grantable: true,
        'other-prop': 123
      }
      result = await unbound({
        badges: async () => [someBadge],
        teamBadgeGroupId: someGroupId
      })
    })

    it('picks id', () => expect(result[0].id).toBe(someBadge.id))
    it('picks name', () => expect(result[0].name).toBe(someBadge.name))
    it('picks description', () =>
      expect(result[0].description).toBe(someBadge.description))
    it('picks image', () => expect(result[0].image).toBe(someBadge.image))
    it('picks slug', () => expect(result[0].slug).toBe(someBadge.slug))
    it('DOES NOT pick badge_grouping_id', () =>
      expect(result[0].badge_grouping_id).toBeUndefined())
    it('DOES NOT pick other properties', () =>
      expect(result[0]['other-prop']).toBeUndefined())
  })
})

const someGroupId = Symbol('someGroupId')
const someOtherGroupId = Symbol('someOtherGroupId')
