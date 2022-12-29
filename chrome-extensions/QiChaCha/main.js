

chrome.runtime.onMessage.addListener(function(request, sender) {
  const action = request.action
  // 下载
  if (action === 'begin') {
    beginFetch()
  }
})

function beginFetch() {
  console.log('开始获取数据')
  // document.querySelector('.app-search-input .input-group-btn>.btn-primary').click()
  console.log(111)
  // const $searchKey = document.querySelector('#searchKey')
  // $searchKey.click()
  // $searchKey.focus()
  // $searchKey.value = '914403006188455588'
  fetch('https://www.qcc.com/web/search?key=914403006188455588')
    .then(res => res.body)
    .then(stream => new Response(stream, { headers: { 'Content-Type': 'text/html' } }).text())
    .then(res => {
      const found = res.match(/__INITIAL_STATE__=(.+);\(function/)
      if (found && found.length > 1) {
        console.log('found', found)
        const initalState = JSON.parse(found[1])
        console.log('__INITIAL_STATE__', initalState)
        const keyNo = getPath(initalState, 'search.searchRes.Result[0].KeyNo')
        if (keyNo) {
          console.log('keyNo', keyNo)
        }
      }
    })
  // window.__INITIAL_STATE__.search.searchRes.Result[0].KeyNo
  // 914403006188455588
}

function isObjectLike (val) {
  return val !== null && typeof val === 'object'
}

const reEscapeChar = /\\(\\)?/g
const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g

function stringToPath (string) {
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

function getPath (value, pathStr, defaultValue) {
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
