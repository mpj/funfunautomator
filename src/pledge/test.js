const patreonPledge = require('./unbound')

describe('pledge', () => {
  it('happy path', () =>
    patreonPledge({
      query: (id, params) => {
        expect(id).toBe(6)
        expect(params.uid).toBe(someUserId)
        return Promise.resolve({
            success: true,
            errors: [],
            columns: [ 'discourseid', 'patreonid', 'pledge_cents', 'email' ],
            rows: [ [ 271, '7357096', '500', 'vallis1@gmail.com' ] ]
        })
      }
    }, someUserId).then(result =>
      expect(result).toBe(500))
  )
})

const someUserId = 123
