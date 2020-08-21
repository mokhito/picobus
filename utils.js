exports.safeStringify = function(obj) {
  let cache = []
  return JSON.stringify(obj, (key, val) => {
    if (typeof val === 'object' && val !== null) {
      if (cache.includes(val)) return
      cache.push(val)
    }
    return val
  })
}