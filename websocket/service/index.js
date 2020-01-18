const express = require('express');
const path = require('path');
const {createServer} = require('http');
const WebSocket = require('ws');

const app = express();
app.use(express.static(path.join(__dirname, '/../public')));

const server = createServer(app);
const wss = new WebSocket.Server({server});

wss.on('connection', function (ws) {
    ws.send(returnData({nickname: 'ddxg', age: 26}), function () {
        console.error('---发送失败---')
    });
    console.log('started client interval');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.on('close', function () {
        console.log('stopping client interval');
    });
});

server.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});

function returnData (data) {
    return JSON.stringify({
        ret: 0,
        errmsg: '',
        data: data
    })
}