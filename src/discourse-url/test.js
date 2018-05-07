const factory = require('./factory')

describe('discourseUrl', () => {
  it('happy path', () =>
    expect(
      factory({
        baseUrl: 'https://www.funfunforum.com',
        apiKey: '8cdkjhasdjhdasjkhasdjk02'
      })('/somepath/hello', { someparam: 123 })
    ).toBe(
      'https://www.funfunforum.com/somepath/hello?api_username=system' +
        '&api_key=8cdkjhasdjhdasjkhasdjk02&someparam=123'
    ))
})
