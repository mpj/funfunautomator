const patreonPledge = require('./unbound')
const memo = require('../junction').none

describe('pledge', () => {
  it('happy path', () =>
    patreonPledge(
      {
        memo,
        patreonUser: async (id) => {
          expect(id).toBe(someUserId)
          return {
            pledge_cents: 666
          }
        }
      },
      someUserId
    ).then(result => expect(result).toBe(666)))
})

const someUserId = 123
