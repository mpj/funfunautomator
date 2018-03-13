const sniff = require('supersniff')
const discourseURL = require('./')
sniff.memo('sniff-output.json', async () =>
  discourseURL('/somepath', { params: 123 })) //?
