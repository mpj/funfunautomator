const pledgeData = require('./unbound')
const memo = require('../junction').none

describe('pledgeData', () => {
  it('happy path', () =>
    pledgeData(
      {
        memo,
        query: (id, params) => {
          expect(id).toBe(6)
          expect(params.patreonid).toBe(someUserId)

          return Promise.resolve({
            success: true,
            errors: [],
            columns: ['discourseid', 'patreonid', 'pledge_cents', 'email'],
            rows: [[271, '7357096', '500', 'vallis1@gmail.com']]
          })
        }
      },
      someUserId
    ).then(result => expect(result).toEqual({
      discourseid: 271,
      patreonid: '7357096',
      pledge_cents: '500',
      email: 'vallis1@gmail.com'
    })))

    it('is not patron of us', () =>
      pledgeData(
        {
          memo,
          query: (id, params) => {
            return Promise.resolve({
              rows: []
            })
          }
        },
        someUserId
      ).then(result => expect(result).toBe(null)))
})

const someUserId = 123

