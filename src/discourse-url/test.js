const discourseUrl = require('./unbound')

describe('discourseUrl', () => {
  it('happy path', () =>
    expect(
      discourseUrl(
        'https://www.funfunforum.com',
        '8cdkjhasdjhdasjkhasdjk02',
        '/somepath/hello',
        { someparam: 123 }
      )
    ).toBe(
      'https://www.funfunforum.com/somepath/hello?api_username=system' +
        '&api_key=8cdkjhasdjhdasjkhasdjk02&someparam=123'
    ))
})
