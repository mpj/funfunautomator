const util = require('util')
const fs = require('fs')
const path = require('path')
const writeFile = util.promisify(require('fs').writeFile)
const readFile = util.promisify(require('fs').readFile)

const save = filename => val => {
  // TODO: check for plain object
  return writeFile(filename, JSON.stringify(val, null, 2), 'utf8').then(() => {
    console.log(`Crossroad wrote to ${filename}`)
    return val
  })
}

const load = filename =>
  readFile(filename, 'utf8').then(data => JSON.parse(data))

const crossroad = (label, fn) => {

  if (!process.env.CROSSROAD_DIR) {
    return fn()
  }

  if (!fs.existsSync(process.env.CROSSROAD_DIR)) {
    fs.mkdirSync(process.env.CROSSROAD_DIR)
  }

  const file= path.join(process.env.CROSSROAD_DIR, label + '.json')
  return fs.existsSync(file)
      ? load(file)
      : fn().then(save(file))
}

const passthrough = async (_, fn) => fn()

module.exports = {
  crossroad,
  passthrough
}