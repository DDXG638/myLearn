import MyWebsocket from './indexTs'
console.log('pageIndexTs.ts')

const $btnConnection = <Element>document.querySelector('#btn-connection')
const $btnSend = <Element>document.querySelector('#btn-send')
const $btnAll = <Element>document.querySelector('#btn-all')
const $btnResponse = <Element>document.querySelector('#btn-response')
const $btnStash = <Element>document.querySelector('#btn-stash')
const $btnClose = <Element>document.querySelector('#btn-close')
let myWs: MyWebsocket

$btnConnection.addEventListener('click', function () {
    // ws://dev.xinhulu.com:9800
    myWs = new MyWebsocket({
        wsUrl: `ws://${location.host}/chat`
    })
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
    myWs.conection()
})

$btnSend.addEventListener('click', function () {
    // if (myWs.getReadyState() === WebSocket.OPEN) {
        myWs.send('/user/getUserInfo', {userId: 123456}).then(res => {
            console.log('[---获取用户信息---]', res)
        }, err => {
            console.error('--error--', err)
        }).catch(e => {
            console.error('--catch--', e)
        })
    // }
})

$btnAll.addEventListener('click', function () {
    // if (myWs.getReadyState() === WebSocket.OPEN) {
        myWs.send('/user/getUserInfo', {userId: 123456}).then(data => {
            console.log('---1---', data)
        })
        myWs.send('/task/getTaskList', {taskId: 123456}).then(data => {
            console.log('---2---', data)
        })
        myWs.send('/phonecrm/getPayConsultConf', {payId: 123456}).then(data => {
            console.log('---3---', data)
        }, err => {
            console.log('---3---', err)
        }).catch(err => {
            console.error('err', err)
        })
        myWs.send('/Phonecrm/getConsultChn', {chnId: 123456}).then(data => {
            console.log('---4---', data)
        })
        myWs.send('/my/getConsult', {consultId: 123456}).then(data => {
            console.log('---5---', data)
        })
    // }
})

$btnResponse.addEventListener('click', function () {
    // if (myWs.getReadyState() === WebSocket.OPEN) {
        console.log(myWs.getResponseCallbacks())
    // }
})

$btnStash.addEventListener('click', function () {
    console.log('--stash--', myWs.getStashCallbacks())
})

$btnClose.addEventListener('click', function () {
    console.log('--stash--', myWs.close())
})
