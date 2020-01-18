import MyWebsocket from './index'
console.log('pageIndex.js')

let myWs = new MyWebsocket({wsUrl: `ws://${location.host}/chat`})
myWs.go()
// socketTool.send('起飞咯')