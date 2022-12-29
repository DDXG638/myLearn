export function isObjectLike (val) {
  return val !== null && typeof val === 'object'
}

const reEscapeChar = /\\(\\)?/g
const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g

export function stringToPath (string) {
  const result = []
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('')
  }
  string.replace(rePropName, function (match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match))
    return ''
  })
  return result
}

export function getPath (value, pathStr, defaultValue) {
  if (!isObjectLike(value)) {
    return defaultValue
  }
  const paths = stringToPath(pathStr)
  let obj = value
  let index = 0
  const length = paths.length

  while (obj != null && index < length) {
    obj = obj[paths[index++]]
  }
  return (index && index === length) ? (obj === undefined ? defaultValue : obj) : defaultValue
}

