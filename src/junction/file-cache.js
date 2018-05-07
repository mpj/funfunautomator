const util = require('util')
const fs = require('fs')
const path = require('path')

function makeFileCacheJunction(dir) {
  return async function fileCacheJunction(...args) {
    const [cacheKey, junction, fn] =
      args.length === 3 ? [args[0], args[1], args[2]] : [0, args[0], args[1]]

    const directoryTemplate = process.env.JUNCTION_CACHE_DIRECTORY_TEMPLATE

    if (!directoryTemplate) {
      throw new Error(
        'Environment variable JUNCTION_CACHE_DIRECTORY_TEMPLATE not set'
      )
    }

    const directory = directoryTemplate.replace('{{module}}', dir)

    ensureDirectory(directory)

    const file = path.join(directory, `${junction}.json`)
    const fileExists = fs.existsSync(file)
    const existingStore = fileExists && JSON.parse(await loadString(file))

    if (existingStore.cacheKey === cacheKey) {
      return existingStore.result
    }

    const result = await fn()
    const cacheData = {
      cacheKey,
      result
    }
    const stringToWrite = asPrettyJSON(cacheData)

    writeString(file, stringToWrite)

    return result
  }
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
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
  }
}

module.exports = makeFileCacheJunction
