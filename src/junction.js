const util = require('util')
const fs = require('fs')
const path = require('path')
const isPlainObject = require('is-plain-object')

const makeSnapshot = ({ dir = 'NONE', bypass = false, cache = 0 })  => {

  if (bypass) {
    return bypassSnapshot
  }

  if (dir !== 'NONE') {
    return directorySnapshot({ dir, cache })
  }

  throw new Error('Invalid junction configuration')
}

const directorySnapshot = ({ dir, cache }) => async (junction, fn, ...rest) => {

  if (rest.length > 0)
    throw new Error('Only two arguments allowed to pass to snapshot. Did you try to pass cacheKey? It should be passed to the factory.')

  const directoryTemplate = process.env.JUNCTION_DIRECTORY_TEMPLATE

  if (!directoryTemplate) {
    throw new Error('Environment variable JUNCTION_DIRECTORY_TEMPLATE not set')
  }

  const directory = directoryTemplate.replace('{{module}}', dir)

  ensureDirectory(directory)

  const file = path.join(directory, `${junction}.json`)
  const fileExists = fs.existsSync(file)
  const existingStore = fileExists && JSON.parse(await loadString(file))

  const key = cache === 0 ? 'cache' : `cache:${cache}`
  const stored = existingStore && existingStore[key]
  // If the user has reverted back to 0 we should purge the cache:
  const shouldClear = cache === 0 && Object.keys(existingStore).length > 1
  if (stored && !shouldClear) {
    return stored
  }
  const result = await fn()
  if (!isPlainObject(result)) {
    throw new Error('Only plain objects are supported, clean your output first')
  }

  writeString(file, asPrettyJSON({
    ...(shouldClear ? {} : existingStore), // delete other caches when cache key is 0
    [key]: result
  }))

  return result
}

async function bypassSnapshot(...args) {
  const fn = args[args.length - 1]
  return fn()
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

module.exports = makeSnapshot