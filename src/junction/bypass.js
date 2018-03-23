module.exports = async function bypassSnapshot(...args) {
  const fn = args[args.length - 1]
  return fn()
}
