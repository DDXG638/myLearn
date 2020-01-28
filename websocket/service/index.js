const express = require('express');
const path = require('path');
const {createServer} = require('http');
const WebSocket = require('ws');

const app = express();
app.use(express.static(path.join(__dirname, '/../public')));

const server = createServer(app);
const wss = new WebSocket.Server({server});

wss.on('connection', function (ws) {
    // ws.send(returnData({nickname: 'ddxg', age: 26}), function () {
        
    // });
    console.log('started client interval');

    setInterval(() => {
        console.log('[push]')
        ws.send(returnData('push', 0, 'push-push-push-push'))
    }, 10000)

    ws.on('message', function incoming(message) {
        console.log('[resp]', message);
        let data = null
        try {
            data = JSON.parse(message || '{}')
        } catch (e) {
            data = {}
        }
        let uri = data.uri
        switch (uri) {
            case '/user/getUserInfo':
                ws.send(returnData('resp', data.reqid, {
                    age: 26,
                    account: "wxoydsswVQV8BE0EJlLknc_TlprqeA",
                    mobile: '15515151515',
                    nickname: 'ddxg',
                    uid: '156880048',
                }))
                break
            case '/task/getTaskList':
                ws.send(returnData('resp', data.reqid, [
                    {
                        taskId: 1,
                        title: '小雨伞保险',
                        desc: '小雨伞保险小雨伞保险小雨伞保险小雨伞保险',
                    },
                    {
                        taskId: 2,
                        title: '小雨伞保险2',
                        desc: '小雨伞保险2小雨伞保险小雨伞保险小雨伞保险',
                    },
                    {
                        taskId: 3,
                        title: '小雨伞保险3',
                        desc: '小雨伞保险3小雨伞保险小雨伞保险小雨伞保险',
                    },
                ]))
                break
            case '/phonecrm/getPayConsultConf':
                ws.send(returnData('resp', data.reqid, {
                    "conf": {
                        "bottonLabel": "点我呀",
                        "priceDesc": "",
                        "price": "0",
                        "originPrice": 6800,
                        "begtime": "1579104000",
                        "endtime": "1579536000",
                        "totalLimit": "0",
                        "totalNum": 0,
                        "share_title": "",
                        "share_desc": "",
                        "share_pic": ""
                    },
                    "serverTime": 1579430401
                }))
                break
            case '/Phonecrm/getConsultChn':
                ws.send(returnData('resp', data.reqid, {
                    "chn": "ddxg_test"
                }))
                break
            case '/my/getConsult':
                ws.send(returnData('resp', data.reqid, [
                    {
                        "question_state": 0,
                        "id": "296294",
                        "clientid": "28068",
                        "product_name": "保险问诊服务",
                        "username": "肖东锐",
                        "payment": 4900,
                        "question_id": 10560,
                        "banner": "",
                        "jump_url": "",
                        "agent_state": 1,
                        "case_state": 1,
                        "wx_state": 2
                    },
                    {
                        "question_state": 0,
                        "id": "296293",
                        "clientid": "28068",
                        "product_name": "保险问诊服务",
                        "username": "肖东锐",
                        "payment": 4900,
                        "question_id": 10559,
                        "banner": "",
                        "jump_url": "",
                        "agent_state": 1,
                        "case_state": 1,
                        "wx_state": 2
                    }
                ]))
                break
            case 'ping': // 收到客户端发来的ping请求就，回复pong相应
                ws.send(returnData('pong', 0, 'pong-pong'))
                // ws.close()
                break
            default: 
                console.log('default')
        }
    });

    ws.on('close', function () {
        console.log('stopping client interval');
    });
});

server.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});

function returnData (msgtype, reqid, data) {
    return JSON.stringify({
        reqid,
        msgtype,
        ret: 0,
        errmsg: '',
        data: data
    })
}