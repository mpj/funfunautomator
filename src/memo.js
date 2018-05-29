const util = require('util')
const fs = require('fs')
const path = require('path')
const isPlainObject = require('is-plain-object')

const memo = (module, ...extra)  => {
  if(extra.length > 0) {
    throw new Error('memo factory called with more than one argument, did you pass it as a function?')
  }
  if (!module) {
    return async function none(...args) {
      const fn = args[args.length - 1]
      return fn()
    }
  }

  return async (...args) => {

    const directoryTemplate = process.env.JUNCTION_MEMO_DIRECTORY

    if (!directoryTemplate) {
      throw new Error('Environment variable JUNCTION_MEMO_DIRECTORY not set')
    }

    let version, junction, fn
    if (args.length === 3) {
      version = args[0]
      junction = args[1]
      fn = args[2]
    } else if(args.length === 2) {
      version = NO_VERSION
      junction = args[0]
      fn = args[1]
    } else {
      throw new Error('invalid number of arguments')
    }



    const directory = directoryTemplate.replace('{{module}}', module)

    ensureDirectory(directory)

    const file = path.join(directory, `${junction}.json`)
    const fileExists = fs.existsSync(file)
    const existingStore = fileExists && JSON.parse(await loadString(file))

    const storedVersion = existingStore && existingStore['v' + version]
    if (storedVersion) {
      if (version === NO_VERSION) {
        // Delete all other versions from store
        writeString(file, asPrettyJSON({
          ['v' + version]: storedVersion
        }))
      }

      return storedVersion
    }
    const result = await fn()
    if (!isPlainObject(result)) {
      throw new Error('Only plain objects are supported, clean your output first')
    }

    writeString(file, asPrettyJSON({
      ...(existingStore || {}),
      ['v' + version]: result
    }))

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

const NO_VERSION = 'none'

module.exports = memo