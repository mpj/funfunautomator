// list all discourse usernames
const fetch = require('node-fetch')
const key = process.env.DISCOURSE_API_KEY

let x = fetch(`https://www.funfunforum.com/admin/users/list/active.json?api_username=system&api_key=${key}&page=1`)
  .then(x => x.json())

x.then(users => users.map(user => user.username)) // ?

/*
({ fetch, bus }) => {
  const
    getPage = R.pipeP(
      page => bus.call('discourse-api-url', { path: '/admin/users/list/active.json', query: `page=${page}` }),
      fetch,
      errorUnlessOK('getPage'),
      parseAsJSON
    ),
    collectNextPageUntilEnd = (collected = [], page = 0) => result => {
      return !result || result.length > 0
        ? getPage(page).then(collectNextPageUntilEnd(collected.concat(result), page + 1))
        : Promise.resolve(collected)
    },
    extractUsernames = R.map(user => user.username)

  return R.pipeP(
    () => getPage(0),
    collectNextPageUntilEnd(),
    extractUsernames
  )
}*/