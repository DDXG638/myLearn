console.log('init')

class MyWebsocket {
    constructor (option) {
        // this.conection(option)
        this.ws = null
        this.requestId = 1
        // 存储send方法传过来的回调函数容器，以reqid为key，回调函数为value的
        this.responseCallbacks = {}
    }

    // resp 应答请求
    requestHandler (data) {
       if (+data.ret === 0) {
           this.responseCallbacks[data.reqid] && this.responseCallbacks[data.reqid](data.data || {})
           delete this.responseCallbacks[data.reqid]
       }
    }

    pushHandler (data) {

    }

    conection () {
        console.log('---开始连接---')
        let ws = this.ws
        if (ws) {
            ws.onerror = ws.onopen = ws.onclose = null;
            ws.close();
        }

        ws = new WebSocket(ws.wsUrl);
        // 简易监听事件
        ws.onerror = function() {
            console.log('-&#45;&#45;WebSocket 连接失败-&#45;&#45;');
        };
        ws.onopen = function() {
            console.log('-&#45;&#45;WebSocket 连接成功-&#45;&#45;', ws.url);
        };
        ws.onclose = function() {
            console.log('-&#45;&#45;WebSocket 连接关闭-&#45;&#45;');
            ws = null;
        };
        ws.addEventListener('message', function (res) {
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
            console.log('-&#45;&#45;获取到服务端的推送 -&#45;&#45;', res);
            console.log('-&#45;&#45;获取到服务端的推送 -&#45;&#45;', JSON.parse(res.data));
        });
    }

    send (uri, param, cb) {
        console.log('---send---', param)
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            let reqid = `${uri}-${this.requestId++}`
            let requestData = {
                uri,
                reqid,
                param
            }
            this.responseCallbacks[reqid] = cb
            this.ws.send(JSON.stringify(requestData))
        }
    }

    go () {
        console.log('gooooo')
    }
}

export default MyWebsocket