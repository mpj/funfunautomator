module.exports = ({
  fetch = require('node-fetch'),
  discourseUrl = require('../discourse-url')
}) => username =>
  //@ts-ignore
  fetch(discourseUrl(`/users/${username}.json`))
    .then(response => response.json())
    .then(body => body.user.groups.map(group => group))
