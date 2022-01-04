class CrmWebSocket {
  constructor (option) {
    // this.connection(option)
    this.ws = null // WebSocket对象
    this.wsUrl = option.wsUrl || ''
    this.requestId = 1 // 一个自增的请求id
    // 存储send方法传过来的回调函数容器，以reqid为key，回调函数为value的
    this.responseCallbacks = {}
    // ws没有准备好的话，需要将请求存储 于 暂存区 中
    this.stashCallbacks = []
    this.heartbeatCheckIntervalTimer = 0
    this.heartbeatIdleTimer = 0
    this.heartbeatCheckIntervalTimes = 30000 // 30秒发送一次ping请求
    this.heartbeatIdleTimes = 10000 // ping请求发送后10秒内没有收到任何回应就会进行重连操作

    this.evnetCb = {
      onopen: [],
      onpush: [],
      onerror: [],
      onclose: [],
    }
  }

  // resp 应答请求
  _requestHandler(data) {
    let reqid = data.reqid
    // console.log(`%c [resp]->${reqid}`, 'color: #409eff;font-weight: bold;', data)
    if (+data.ret === 0) {
      this.responseCallbacks[reqid] && this.responseCallbacks[reqid].resolve(data.data || {})
    } else {
      this.responseCallbacks[reqid] && this.responseCallbacks[reqid].reject(data.data || {})
    }

    delete this.responseCallbacks[reqid]
  }

  _pushHandler(data) {
    console.log('%c [push]', 'color: #409eff;font-weight: bold;', data)
    this.emit('onpush', data)
  }

  connection() {
    if (this.ws) {
      this.ws.onerror = this.ws.onopen = this.ws.onclose = this.ws.onmessage = null
      this.close()
    }

    if (!this.wsUrl) {
      throw new Error('没有设置链接websocket的链接')
    }

    this.ws = new WebSocket(this.wsUrl)
    // 简易监听事件
    this.ws.onerror = (event) => { // 用于指定连接失败后的回调函数。
      this.emit('onerror')
      console.log('%c [WebSocket 连接失败', 'color: #f56c6c;font-weight: bold;', event)
    }
    this.ws.onopen = () => { // 用于指定连接成功后的回调函数。
      console.log('%c [WebSocket 连接成功]', 'color: #67c23a;font-weight: bold;', this.wsUrl)
      this.emit('onopen')
      this._stashCallbacksHandler() // 处理 暂存区 中的任务
      this._checkHeardBeat() // 开始心跳检测
    }
    this.ws.onclose = (event) => { // 用于指定连接关闭后的回调函数。
      console.log('%c [WebSocket 连接关闭]', 'color: #f56c6c;font-weight: bold;', event)
      // see: https://developer.mozilla.org/zh-CN/docs/Web/API/CloseEvent
      // const code = event.code // 是服务器返回的数值状态码
      // const reason = event.reason // 字符串，包含服务器发回的信息
      // const wasClean = event.wasClean // 是一个布尔值，表示是否正常断开。一般异常断开时，该值为false
      this.emit('onclose')
      // this.ws = null;
      // this._clearHeardBeat() // 关闭心跳检测
    }
    this.ws.onmessage = (res) => { // 用于指定当从服务器接受到信息时的回调函数。
      let data
      try {
        data = JSON.parse(res.data)
      } catch (e) {
        data = {}
      }
      if (data.msgtype === 'resp') {
        // resp 应答请求
        this._requestHandler(data)
      } else if (data.msgtype === 'push') {
        // 服务端主动推送
        this._pushHandler(data.data || {})
      } else if (data.msgtype === 'pong') { // TODO: 测试
        console.log(`%c [pong]`, 'color: #409eff;font-weight: bold;')
      }

      this._checkHeardBeat()
    }
  }

  close() {
    this._clearHeardBeat()

    if (this.ws) {
      this.ws.close()
    }
  }

  // 重新链接ws
  _reconnection() {
    if ([WebSocket.CLOSING, WebSocket.CLOSED, 4].includes(this.getReadyState())) {
      console.log('%c [WebSocket 重新链接]', 'color: #f56c6c;font-weight: bold;')
      this.connection()
    } else {
      this._checkHeardBeat()
    }
  }

  send(uri, param) {
    if (!uri) {
      return
    }
    let reqid = `${uri}-${this.requestId++}`
    let requestData = {
      uri,
      reqid,
      param,
    }
    return new Promise((resolve, reject) => {
      if (uri !== '/ping') {
        this.responseCallbacks[reqid] = {
          resolve,
          reject,
        }
      }
      this._sendHandler(requestData)
    })
  }

  // 处理发送ws请求
  _sendHandler(requestData) {
    let readyState = this.getReadyState()
    switch (readyState) {
      case WebSocket.CONNECTING: // 正在链接中
        console.log(`%c [stash-connecting]->${requestData.reqid}`, 'color: #409eff;font-weight: bold;', requestData.param)
        this.stashCallbacks.push(requestData)
        break
      case WebSocket.OPEN: // 已经链接并且可以通讯
        console.log(`%c [send]->${requestData.reqid}`, 'color: #409eff;font-weight: bold;', requestData.param)
        this.ws.send(JSON.stringify(requestData))
        break
      case WebSocket.CLOSING: // 连接正在关闭
        console.log(`%c [stash-closing]->${requestData.reqid}`, 'color: #409eff;font-weight: bold;', requestData.param)
        this.stashCallbacks.push(requestData)
        this._reconnection()
        break
      case WebSocket.CLOSED: // 连接已关闭或者没有链接成功
        console.log(`%c [stash-closed]->${requestData.reqid}`, 'color: #409eff;font-weight: bold;', requestData.param)
        this.stashCallbacks.push(requestData)
        // 重连
        this._reconnection()
        break
      case 4: // 没有创建 CrmWebSocket 实例
        // 不记录send请求的回调
        delete this.responseCallbacks[requestData.reqid]
        break
      default:
        console.log('default')
    }
  }

  // ws链接正常之后立即处理 暂存区 中的请求
  _stashCallbacksHandler() {
    if (this.stashCallbacks.length) {
      this.stashCallbacks.forEach(requestData => {
        this.ws.send(JSON.stringify(requestData))
      })
      this.stashCallbacks.splice(0, this.stashCallbacks.length)
    }
  }

  // 心跳检测
  _checkHeardBeat() {
    this._clearHeardBeat()

    this.heartbeatCheckIntervalTimer = setTimeout(() => {
      this.send('/ping', null)
      // console.log(`%c [ping]`, 'color: #409eff;font-weight: bold;')
      this.heartbeatIdleTimer = setTimeout(() => {
        // 认为ws没有正常连接，需要重新连接
        this._reconnection()
      }, this.heartbeatIdleTimes)
    }, this.heartbeatCheckIntervalTimes)
  }

  _clearHeardBeat() {
    clearTimeout(this.heartbeatCheckIntervalTimer)
    clearTimeout(this.heartbeatIdleTimer)
  }

  // 注册监听事件
  on(eventName, cb) {
    if (!isFunction(cb)) {
      return
    }
    if (this.evnetCb[eventName]) {
      this.evnetCb[eventName].push(cb)
    } else {
      this.evnetCb[eventName] = [cb]
    }
  }

  // 触发监听事件
  emit(eventName, data = null) {
    if (this.evnetCb[eventName] && this.evnetCb[eventName].length) {
      this.evnetCb[eventName].forEach(cb => {
        if (isFunction(cb)) {
          cb(data)
        }
      })
    }
  }

  // 返回当前 WebSocket 的链接状态，只读。
  /**
   * 0: 正在链接中,WebSocket.CONNECTING
   * 1: 已经链接并且可以通讯,WebSocket.OPEN
   * 2: 连接正在关闭,WebSocket.CLOSING
   * 3: 连接已关闭或者没有链接成功,WebSocket.CLOSED
   * 4: 还没有建立ws连接
   */
  getReadyState() {
    return this.ws ? this.ws.readyState : 4
  }

  // TODO: 测试功能
  getResponseCallbacks() {
    return this.responseCallbacks
  }

  // TODO: 测试功能，获取处于暂存区中的请求
  getStashCallbacks() {
    return this.stashCallbacks
  }
}

function isType(value, type) {
  return Object.prototype.toString.call(value) === '[object ' + type + ']'
}

function isFunction(fn) {
  return typeof fn === 'function' || isType(fn, 'Function')
}

export default CrmWebSocket
