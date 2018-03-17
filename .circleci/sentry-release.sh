curl https://sentry.io/api/0/organizations/maximumsheep/releases/ \
  -X POST \
  -H 'Authorization: Bearer $SENTRY_RELEASE_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '
  {
    "version": "`git rev-parse HEAD`",
    "refs": [{
        "repository":"mpj/funfunautomator",
        "commit":"`git rev-parse HEAD`"
    }],
    "projects":["funfunautomator"]
}'