const { file, none } = require('./unbound')

module.exports = {
  none,
  file: file.bind(null,
    process.env.JUNCTION_MEMO_DIRECTORY
  )
}