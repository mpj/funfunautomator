const util = require('util')
const fs = require('fs')
const path = require('path')
const isPlainObject = require('is-plain-object')

async function none(...args) {
  const fn = args[args.length - 1]
  return fn()
}

async function file(directoryTemplate, module, ...rest) {

  let version, junction, fn
  if (rest.length === 3) {
    version = rest[0]
    junction = rest[1]
    fn = rest[2]
  } else {
    version = 0
    junction = rest[0]
    fn = rest[1]
  }

  const directory = directoryTemplate.replace('{{module}}', module)

  ensureDirectory(directory)

  const file = path.join(directory, `${junction}.json`)

  const fileExists = fs.existsSync(file)

  const existingStore = fileExists && JSON.parse(await loadString(file))

  const storedVersion = existingStore && existingStore['v' + version]
  if (storedVersion) return storedVersion

  const result = await fn()
  if (!isPlainObject(result)) {
    throw new Error('Only plain objects are supported, clean your output first')
  }

  writeString(asPrettyJSON({
    ...(existingStore || {}),
    ['v' + version]: result
  }))

  return result
}


const writeFile = util.promisify(require('fs').writeFile)
const readFile = util.promisify(require('fs').readFile)
const asPrettyJSON = obj => JSON.stringify(obj, null, 2)


function writeString(filename, string) {
  return writeFile(filename, string, 'utf8')
}

function loadString(filename) {
  return readFile(filename, 'utf8')
}

function ensureDirectory(directory) {
  if (fs.existsSync(directory)) {
    fs.mkdirSync(directory)
  }
}

module.exports = {
  file,
  none
}