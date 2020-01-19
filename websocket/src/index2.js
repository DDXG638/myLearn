console.log('init')

class MyWebsocket {
    constructor (option) {
        // this.conection(option)
        this.ws = null
        this.requestId = 1
        // 存储send方法传过来的回调函数容器，以reqid为key，回调函数为value的
        this.responseCallbacks = {}
        this.evnetCb = {
            onopen: []
        }
    }

    // resp 应答请求
    requestHandler (data) {
        let reqid = data.reqid
        console.log(`%c [resp]->${reqid}`, 'color: #409eff;font-weight: bold;', data)
        if (+data.ret === 0) {
           this.responseCallbacks[reqid] && this.responseCallbacks[reqid].resolve(data.data || {})
        } else {
            this.responseCallbacks[reqid] && this.responseCallbacks[reqid].reject(data.data || {})
        }

        delete this.responseCallbacks[reqid]
    }

    pushHandler (data) {
        console.log('%c [push]', 'color: #409eff;font-weight: bold;', data)
    }

    conection (wsUrl) {
        if (this.ws) {
            this.ws.onerror = this.ws.onopen = ws.onclose = null;
            this.ws.close();
        }

        this.ws = new WebSocket(wsUrl);
        // 简易监听事件
        this.ws.onerror = function() {
            console.log('%c [WebSocket 连接失败', 'color: #f56c6c;font-weight: bold;');
        };
        this.ws.onopen = () => {
            this.emit('onopen')
            console.log('%c [WebSocket 连接成功]', 'color: #67c23a;font-weight: bold;', wsUrl);
        };
        this.ws.onclose = function() {
            console.log('%c [WebSocket 连接关闭]', 'color: #f56c6c;font-weight: bold;');
            this.ws = null;
        };
        this.ws.addEventListener('message', (res) => {
            // console.log('---获取到服务端的推送 ---;', res);
            // console.log('---获取到服务端的推送 ---', JSON.parse(res.data));
            let data
            try {
                data = JSON.parse(res.data)
            } catch (e) {
                data = {}
            }
            if (data.msgtype === 'resp') {
                // resp 应答请求
                this.requestHandler(data)
            } else if (data.msgtype === 'push') {
                // 服务端主动推送
                this.pushHandler(data)
            }
        });
    }

    send (uri, param) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            let reqid = `${uri}-${this.requestId++}`
            let requestData = {
                uri,
                reqid,
                param
            }
            console.log(`%c [send]->${reqid}`, 'color: #409eff;font-weight: bold;', param)
            return new Promise((resolve, reject) => {
                this.responseCallbacks[reqid] = {
                    resolve,
                    reject
                }
                this.ws.send(JSON.stringify(requestData))
            })
        }
    }

    // 注册监听事件
    on (eventName, cb) {
        if (this.evnetCb[eventName]) {
            this.evnetCb[eventName].push(cb)
        } else {
            this.evnetCb[eventName] = [cb]
        }
    }

    // 触发监听事件
    emit (eventName, data = null) {
        if (this.evnetCb[eventName] && this.evnetCb[eventName].length) {
            this.evnetCb[eventName].forEach(cb => {
                cb(data)
            });
        }
    }

    // 返回当前 WebSocket 的链接状态，只读。
    getReadyState () {
        return this.ws ? this.ws.readyState : 4
    }

    go () {
        console.log('gooooo')
    }

    getResponseCallbacks () {
        return this.responseCallbacks
    }
}

export default MyWebsocket