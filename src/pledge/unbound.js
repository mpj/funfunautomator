module.exports = ({ patreonUser, memo }, id) =>
  memo('patreon-user', () => patreonUser(id))
    .then(x => x.pledge_cents)
    .then(parseInt)
