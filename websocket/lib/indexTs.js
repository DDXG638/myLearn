console.log('init');
var MyWebsocket = /** @class */ (function () {
    function MyWebsocket(option) {
        this.requestId = 1;
        // 存储send方法传过来的回调函数容器，以reqid为key，回调函数为value的
        this.responseCallbacks = {};
        // ws没有准备好的话，需要将请求存储 于 暂存区 中
        this.stashCallbacks = [];
        this.heartbeatCheckIntervalTimer = 0;
        this.heartbeatIdleTimer = 0;
        this.heartbeatCheckIntervalTimes = 5000;
        this.heartbeatIdleTimes = 10000;
        this.evnetCb = {
            onopen: [],
            onpush: [],
            onerror: [],
            onclose: [],
        };
        this.wsUrl = option.wsUrl || '';
        this.ws = null;
    }
    /**
     * 连接websocket
     */
    MyWebsocket.prototype.conection = function () {
        var _this = this;
        if (this.ws) {
            this.ws.onerror = this.ws.onopen = this.ws.onclose = this.ws.onmessage = null;
            this.close();
        }
        if (!this.wsUrl) {
            throw new Error('没有设置链接websocket的链接');
        }
        this.ws = new WebSocket(this.wsUrl);
        // 简易监听事件
        this.ws.onerror = function (event) {
            _this.emit('onerror');
            console.log('%c [WebSocket 连接失败', 'color: #f56c6c;font-weight: bold;', event);
        };
        this.ws.onopen = function () {
            console.log('%c [WebSocket 连接成功]', 'color: #67c23a;font-weight: bold;', _this.wsUrl);
            _this.emit('onopen');
            _this.stashCallbacksHandler();
            _this.checkHeardBeat();
        };
        this.ws.onclose = function (event) {
            console.log('%c [WebSocket 连接关闭]', 'color: #f56c6c;font-weight: bold;', event);
            _this.emit('onclose');
            // this.ws = null;
            // TODO: ws连接关闭后需要重新链接吗？
        };
        this.ws.onmessage = function (res) {
            // console.log('---获取到服务端的推送 ---;', res);
            // console.log('---获取到服务端的推送 ---', JSON.parse(res.data));
            var data;
            try {
                data = JSON.parse(res.data);
            }
            catch (e) {
                data = {};
            }
            if (data.msgtype === 'resp') {
                // resp 应答请求
                _this.requestHandler(data);
            }
            else if (data.msgtype === 'push') {
                // 服务端主动推送
                _this.pushHandler(data.data);
            }
            else if (data.msgtype === 'pong') { // TODO: 测试
                console.log("%c [pong]", 'color: #409eff;font-weight: bold;');
            }
            _this.checkHeardBeat();
        };
    };
    /**
     * 关闭websocket连接
     */
    MyWebsocket.prototype.close = function () {
        clearTimeout(this.heartbeatCheckIntervalTimer);
        clearTimeout(this.heartbeatIdleTimer);
        if (this.ws) {
            this.ws.close();
        }
    };
    // TODO
    MyWebsocket.prototype.send = function (uri, param) {
        var _this = this;
        // if (this.getReadyState() !== 4) {
        var reqid = uri + "-" + this.requestId++;
        var requestData = {
            uri: uri,
            reqid: reqid,
            param: param
        };
        return new Promise(function (resolve, reject) {
            _this.responseCallbacks[reqid] = {
                resolve: resolve,
                reject: reject
            };
            _this.sendHandler(requestData);
        });
        // }
    };
    // 返回当前 WebSocket 的链接状态，只读。
    /**
     * 0: 正在链接中,WebSocket.CONNECTING
     * 1: 已经链接并且可以通讯,WebSocket.OPEN
     * 2: 连接正在关闭,WebSocket.CLOSING
     * 3: 连接已关闭或者没有链接成功,WebSocket.CLOSED
     * 4: 还没有建立ws连接
     */
    MyWebsocket.prototype.getReadyState = function () {
        return this.ws ? this.ws.readyState : 4;
    };
    // TODO: 测试功能
    MyWebsocket.prototype.go = function () {
        console.log('gooooo');
    };
    // TODO: 测试功能
    MyWebsocket.prototype.getResponseCallbacks = function () {
        return this.responseCallbacks;
    };
    // TODO: 测试功能，获取处于暂存区中的请求
    MyWebsocket.prototype.getStashCallbacks = function () {
        return this.stashCallbacks;
    };
    // 处理发送ws请求
    MyWebsocket.prototype.sendHandler = function (requestData) {
        var readyState = this.getReadyState();
        switch (readyState) {
            case WebSocket.CONNECTING: // 正在链接中
                console.log("%c [stash-connecting]->" + requestData.reqid, 'color: #409eff;font-weight: bold;', requestData.param);
                this.stashCallbacks.push(requestData);
                break;
            case WebSocket.OPEN: // 已经链接并且可以通讯
                console.log("%c [send]->" + requestData.reqid, 'color: #409eff;font-weight: bold;', requestData.param);
                this.ws && this.ws.send(JSON.stringify(requestData));
                break;
            case WebSocket.CLOSING: // 连接正在关闭
                console.log("%c [stash-closing]->" + requestData.reqid, 'color: #409eff;font-weight: bold;', requestData.param);
                this.stashCallbacks.push(requestData);
                this.reconection();
                break;
            case WebSocket.CLOSED: // 连接已关闭或者没有链接成功
                console.log("%c [stash-closed]->" + requestData.reqid, 'color: #409eff;font-weight: bold;', requestData.param);
                this.stashCallbacks.push(requestData);
                // 重连
                this.reconection();
                break;
            case 4: // 没有创建 MyWebsocket 实例
                // 不记录send请求的回调
                delete this.responseCallbacks[requestData.reqid];
                break;
            default:
                console.log('default');
        }
    };
    // 服务端 resp 应答数据处理
    MyWebsocket.prototype.requestHandler = function (data) {
        var reqid = data.reqid;
        console.log("%c [resp]->" + reqid, 'color: #409eff;font-weight: bold;', data);
        if (+data.ret === 0) {
            this.responseCallbacks[reqid] && this.responseCallbacks[reqid].resolve(data || {});
        }
        else {
            this.responseCallbacks[reqid] && this.responseCallbacks[reqid].reject(data || {});
        }
        delete this.responseCallbacks[reqid];
    };
    // 服务端 push 数据处理
    MyWebsocket.prototype.pushHandler = function (data) {
        console.log('%c [push]', 'color: #409eff;font-weight: bold;', data);
        this.emit('onpush', data);
    };
    // ws链接正常之后立即处理 暂存区 中的请求
    MyWebsocket.prototype.stashCallbacksHandler = function () {
        var _this = this;
        if (this.stashCallbacks.length) {
            this.stashCallbacks.forEach(function (requestData) {
                _this.ws && _this.ws.send(JSON.stringify(requestData));
            });
            this.stashCallbacks.splice(0, this.stashCallbacks.length);
        }
    };
    // 心跳检测
    MyWebsocket.prototype.checkHeardBeat = function () {
        var _this = this;
        clearTimeout(this.heartbeatCheckIntervalTimer);
        clearTimeout(this.heartbeatIdleTimer);
        this.heartbeatCheckIntervalTimer = setTimeout(function () {
            _this.send('ping');
            // console.log(`%c [ping]`, 'color: #409eff;font-weight: bold;')
            _this.heartbeatIdleTimer = setTimeout(function () {
                // 认为ws没有正常连接，需要重新连接
                _this.reconection();
            }, _this.heartbeatIdleTimes);
        }, this.heartbeatCheckIntervalTimes);
    };
    // 重新链接ws
    MyWebsocket.prototype.reconection = function () {
        if ([WebSocket.CLOSING, WebSocket.CLOSED, 4].includes(this.getReadyState())) {
            console.log('%c [WebSocket 重新链接]', 'color: #f56c6c;font-weight: bold;');
            this.conection();
        }
    };
    // 注册监听事件
    MyWebsocket.prototype.on = function (eventName, cb) {
        if (this.evnetCb[eventName]) {
            this.evnetCb[eventName].push(cb);
        }
        else {
            this.evnetCb[eventName] = [cb];
        }
    };
    // 触发监听事件
    MyWebsocket.prototype.emit = function (eventName, data) {
        if (data === void 0) { data = null; }
        if (this.evnetCb[eventName] && this.evnetCb[eventName].length) {
            this.evnetCb[eventName].forEach(function (cb) {
                cb(data);
            });
        }
    };
    return MyWebsocket;
}());
export default MyWebsocket;
