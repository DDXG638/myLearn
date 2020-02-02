console.log('init')

interface IOption {
    wsUrl: string;
    [pronName: string]: any;
}

interface IResponseCallbacksItem {
    resolve: Function;
    reject: Function;
}

interface IResponseCallbacks {
    [pronName: string]: IResponseCallbacksItem;
}

interface IParam {
    [pronName: string]: any
}

interface IStashCallbacksItem {
    uri: string;
    reqid: string;
    param?: IParam;
}

// 服务端返回接口数据结构
interface IResponseData {
    ret: number
    msgtype: string;
    data: IParam;
    errmsg: string;
    reqid: number;
    [pronName: string]: any;
}

// 服务端返回push数据结构
interface IPushData {
    event: string;
    eventid: number;
    createtime: number;
    [pronName: string]: any;
}

interface IPushFunction {
    (data: IPushData): void;
}

interface IEvnetCb {
    onopen: Array<Function>;
    onpush: Array<IPushFunction>;
    onerror: Array<Function>;
    onclose: Array<Function>;
    [pronName: string]: Array<Function>;
}

class MyWebsocket {
    private ws: WebSocket | null
    wsUrl: string
    private requestId: number = 1
    // 存储send方法传过来的回调函数容器，以reqid为key，回调函数为value的
    responseCallbacks: IResponseCallbacks = {}
    // ws没有准备好的话，需要将请求存储 于 暂存区 中
    stashCallbacks: Array<IStashCallbacksItem> = []
    private heartbeatCheckIntervalTimer = 0
    private heartbeatIdleTimer = 0
    private heartbeatCheckIntervalTimes = 5000
    private heartbeatIdleTimes = 10000
    private evnetCb: IEvnetCb = {
        onopen: [],
        onpush: [],
        onerror: [],
        onclose: [],
    }

    constructor (option: IOption) {
        this.wsUrl = option.wsUrl || ''
        this.ws = null
    }

    /**
     * 连接websocket
     */
    conection () {
        if (this.ws) {
            this.ws.onerror = this.ws.onopen = this.ws.onclose = this.ws.onmessage = null;
            this.close();
        }

        if (!this.wsUrl) {
            throw new Error('没有设置链接websocket的链接')
        }

        this.ws = new WebSocket(this.wsUrl);
        // 简易监听事件
        this.ws.onerror = (event) => {
            this.emit('onerror')
            console.log('%c [WebSocket 连接失败', 'color: #f56c6c;font-weight: bold;', event);
        };
        this.ws.onopen = () => {
            console.log('%c [WebSocket 连接成功]', 'color: #67c23a;font-weight: bold;', this.wsUrl);
            this.emit('onopen')
            this.stashCallbacksHandler()
            this.checkHeardBeat()
        };
        this.ws.onclose = (event) => {
            console.log('%c [WebSocket 连接关闭]', 'color: #f56c6c;font-weight: bold;', event);
            this.emit('onclose')
            // this.ws = null;
            // TODO: ws连接关闭后需要重新链接吗？
        };
        this.ws.onmessage = (res) => {
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
                this.pushHandler(data.data)
            } else if (data.msgtype === 'pong') { // TODO: 测试
                console.log(`%c [pong]`, 'color: #409eff;font-weight: bold;')
                delete this.responseCallbacks[data.reqid]
            }

            this.checkHeardBeat()
        };
    }

    /**
     * 关闭websocket连接
     */
    close () {
        clearTimeout(this.heartbeatCheckIntervalTimer)
        clearTimeout(this.heartbeatIdleTimer)
        
        if (this.ws) {
            this.ws.close();
        }
    }

    // TODO
    send (uri: string, param?: IParam): Promise<IResponseData> {
        // if (this.getReadyState() !== 4) {
            let reqid = `${uri}-${this.requestId++}`
            let requestData = {
                uri,
                reqid,
                param
            }
            return new Promise((resolve, reject) => {
                this.responseCallbacks[reqid] = {
                    resolve,
                    reject
                }
                this.sendHandler(requestData)
            })
        // }
    }

    // 返回当前 WebSocket 的链接状态，只读。
    /**
     * 0: 正在链接中,WebSocket.CONNECTING
     * 1: 已经链接并且可以通讯,WebSocket.OPEN
     * 2: 连接正在关闭,WebSocket.CLOSING
     * 3: 连接已关闭或者没有链接成功,WebSocket.CLOSED
     * 4: 还没有建立ws连接
     */
    getReadyState (): number {
        return this.ws ? this.ws.readyState : 4
    }

    // TODO: 测试功能
    go () {
        console.log('gooooo')
    }

    // TODO: 测试功能
    getResponseCallbacks () {
        return this.responseCallbacks
    }

    // TODO: 测试功能，获取处于暂存区中的请求
    getStashCallbacks () {
        return this.stashCallbacks
    }

    // 处理发送ws请求
    private sendHandler (requestData: IStashCallbacksItem) {
        let readyState = this.getReadyState()
        switch (readyState) {
            case WebSocket.CONNECTING: // 正在链接中
                console.log(`%c [stash-connecting]->${requestData.reqid}`, 'color: #409eff;font-weight: bold;', requestData.param)
                this.stashCallbacks.push(requestData)
                break
            case WebSocket.OPEN: // 已经链接并且可以通讯
                console.log(`%c [send]->${requestData.reqid}`, 'color: #409eff;font-weight: bold;', requestData.param)
                this.ws && this.ws.send(JSON.stringify(requestData))
                break
            case WebSocket.CLOSING: // 连接正在关闭
                console.log(`%c [stash-closing]->${requestData.reqid}`, 'color: #409eff;font-weight: bold;', requestData.param)
                this.stashCallbacks.push(requestData)
                this.reconection()
                break
            case WebSocket.CLOSED: // 连接已关闭或者没有链接成功
                console.log(`%c [stash-closed]->${requestData.reqid}`, 'color: #409eff;font-weight: bold;', requestData.param)
                this.stashCallbacks.push(requestData)
                // 重连
                this.reconection()
                break
            case 4: // 没有创建 MyWebsocket 实例
                // 不记录send请求的回调
                delete this.responseCallbacks[requestData.reqid]
                break
            default:
                console.log('default')
        }
    }

    // 服务端 resp 应答数据处理
    private requestHandler (data: IResponseData) {
        let reqid = data.reqid
        console.log(`%c [resp]->${reqid}`, 'color: #409eff;font-weight: bold;', data)
        if (+data.ret === 0) {
            this.responseCallbacks[reqid] && this.responseCallbacks[reqid].resolve(data || {})
        } else {
            this.responseCallbacks[reqid] && this.responseCallbacks[reqid].reject(data || {})
        }

        delete this.responseCallbacks[reqid]
    }

    // 服务端 push 数据处理
    private pushHandler (data: IPushData) {
        console.log('%c [push]', 'color: #409eff;font-weight: bold;', data)
        this.emit('onpush', data)
    }

    // ws链接正常之后立即处理 暂存区 中的请求
    private stashCallbacksHandler () {
        if (this.stashCallbacks.length) {
            this.stashCallbacks.forEach(requestData => {
                this.ws && this.ws.send(JSON.stringify(requestData))
            })
            this.stashCallbacks.splice(0, this.stashCallbacks.length)
        }
    }

    // 心跳检测
    private checkHeardBeat () {
        clearTimeout(this.heartbeatCheckIntervalTimer)
        clearTimeout(this.heartbeatIdleTimer)

        this.heartbeatCheckIntervalTimer = setTimeout(() => {
            this.send('ping')
            // console.log(`%c [ping]`, 'color: #409eff;font-weight: bold;')
            this.heartbeatIdleTimer = setTimeout(() => {
                // 认为ws没有正常连接，需要重新连接
                this.reconection()
            }, this.heartbeatIdleTimes)
        }, this.heartbeatCheckIntervalTimes)
    }

    // 重新链接ws
    private reconection () {
        if ([WebSocket.CLOSING, WebSocket.CLOSED, 4].includes(this.getReadyState())) {
            console.log('%c [WebSocket 重新链接]', 'color: #f56c6c;font-weight: bold;');
            this.conection()
        }
    }

    // 注册监听事件
    on (eventName: string, cb: IPushFunction) {
        if (this.evnetCb[eventName]) {
            this.evnetCb[eventName].push(cb)
        } else {
            this.evnetCb[eventName] = [cb]
        }
    }

    // 触发监听事件
    emit (eventName: string, data: any = null) {
        if (this.evnetCb[eventName] && this.evnetCb[eventName].length) {
            this.evnetCb[eventName].forEach(cb => {
                cb(data)
            });
        }
    }
}

export default MyWebsocket