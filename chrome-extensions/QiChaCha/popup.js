let tabId = undefined
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  // 取出当前标签页的 tag_id, 发送一个消息出去, 同时带上回调函数
  tabId = tabs[0].id
})


const $beginBtn = document.getElementById('begin-get-data')

$beginBtn.addEventListener('click', function() {
  chrome.tabs.sendMessage(tabId, { action: 'begin' })
})
