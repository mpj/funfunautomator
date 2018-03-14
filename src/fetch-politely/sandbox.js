const fetchPolitely = require('./')
const discourseUrl = require('../discourse-url')

let i = 0
function keepFetching() {
  fetchPolitely(discourseUrl('/admin/users/list/active.json'))
    .then(() => i++ && console.log('fetched', i, 'times...'))
    .then(keepFetching)
}
keepFetching()