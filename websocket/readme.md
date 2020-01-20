> websocket 的一个小DEMO，主要内容是浏览器端的代码

### 运行

``` shell
# 安装依赖
npm install
# 运行简易的node服务，使用ws库处理websocket
npm run serve
# 打包浏览器端使用的代码
npm run build
```

### 简要介绍

websocket封装代码：`src/index2.js`

一个 `MyWebsocket` 对象，主要的属性：
- `responseCallbacks`：存储send方法传过来的回调函数容器，以reqid为key，该promise的resolve和reject为value
-  `evnetCb`：MyWebsocket实例可监听的事件，有 `onopen` 和 `onpush` 事件
    - `onopen` 就是 `websocket` 链接成功的事件
    - `onpush` 就是服务端主动推送的事件回调
    - `onerror` 就是 `websocket` 链接失败的事件
    - `onclose` 就是 `websocket` 链接关闭的事件

`MyWebsocket` 对象，主要的方法：
- `send(uri, param)`：发送一个接口请求，返回promise，将此promise的`resolve`方法和`reject`方法存于`responseCallbacks`属性中，以`reqid`为`key`
- `conection (wsUrl)`：链接 `websocket`
- `requestHandler (data)`：处理接口请求的返回逻辑，先获取reqid，然后reqid找到responseCallbacks中存的resolve和reject方法，根据返回结果调用哪个方法
- `on (eventName, cb)`：注册监听某个事件
- `emit (eventName, data)`：触发某个事件


### 使用

```
let myWs = new MyWebsocket() // 创建实例

// 一波监听
myWs.on('onopen', function () {
    console.log('---外：websocket链接成功---')
})
myWs.on('onpush', function (data) {
    console.log('---外：服务端主动推送---', data)
})
myWs.on('onerror', function () {
    console.log('---外：WebSocket 连接失败---')
})
myWs.on('onclose', function () {
    console.log('---外：WebSocket 连接关闭---')
})

// 链接websocket
myWs.conection(`ws://${location.host}/chat`)


// 使用websocket发送请求
myWs.send('/my/getConsult', {consultId: 123456}).then(data => {
    console.log('---5---', data)
})
```
