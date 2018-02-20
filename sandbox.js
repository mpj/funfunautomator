// list all discourse usernames
const fetch = require('node-fetch')
const key = process.env.DISCOURSE_API_KEY
const sniff = require('supersniff')
const R = require('ramda')

let username = 'jwalden'
let x = fetch(
  `https://www.funfunforum.com/users/${username}.json` +
  `?api_username=system&api_key=${key}`
)
.then(x => x.json())
.then(x => x.user.groups)
.then(groups => groups.map(group => group.name))
.then(sniff)

//x.then(users => users.map(user => user.username)) // ?
/**/
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