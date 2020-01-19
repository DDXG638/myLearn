import MyWebsocket from './index2'
console.log('pageIndex.js')

const $btnConnection = document.querySelector('#btn-connection')
const $btnSend = document.querySelector('#btn-send')
const $btnAll = document.querySelector('#btn-all')
const $btnResponse = document.querySelector('#btn-response')
let myWs

$btnConnection.addEventListener('click', function () {
    myWs = new MyWebsocket()
    myWs.on('onopen', function () {
        console.log('---外：websocket链接成功---')
        // myWs.send('/user/getUserInfo', {userId: 123456}, function (data) {
        //     console.log('/user/getUserInfo', data)
        // })
    })
    myWs.conection(`ws://${location.host}/chat`)
    myWs.go()
})

$btnSend.addEventListener('click', function () {
    if (myWs.getReadyState() === WebSocket.OPEN) {
        myWs.send('/user/getUserInfo', {userId: 123456}).then(res => {
            console.log('[---获取用户信息---]', res)
        }, err => {
            console.error('--error--', err)
        }).catch(e => {
            console.error('--catch--', e)
        })
    }
})

$btnAll.addEventListener('click', function () {
    if (myWs.getReadyState() === WebSocket.OPEN) {
        myWs.send('/user/getUserInfo', {userId: 123456}).then(data => {
            console.log('---1---', data)
        })
        myWs.send('/task/getTaskList', {taskId: 123456}).then(data => {
            console.log('---2---', data)
        })
        myWs.send('/phonecrm/getPayConsultConf', {payId: 123456}).then(data => {
            console.log('---3---', data)
        })
        myWs.send('/Phonecrm/getConsultChn', {chnId: 123456}).then(data => {
            console.log('---4---', data)
        })
        myWs.send('/my/getConsult', {consultId: 123456}).then(data => {
            console.log('---5---', data)
        })
    }
})

$btnResponse.addEventListener('click', function () {
    if (myWs.getReadyState() === WebSocket.OPEN) {
        console.log(myWs.getResponseCallbacks())
    }
})
