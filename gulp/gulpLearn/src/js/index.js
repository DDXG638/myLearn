// import "@babel/polyfill";
import {trackLogin, trackPageView} from './track';
// const {trackLogin, trackPageView} = require('./track');
// import parseQueryString from 'hy-libs/parseQueryString';
// import chargeInfoAndroid from './chargeAndroid.json';
import chargeInfoAndroid from './chargeAndroid.json';
import chargeInfoIOS from './chargeIOS.json';

// 引入图片
/*const avatar = require('../img/avatar.jpg');
console.log('avatar', avatar);

const logo = require('../img/login.png');
console.log('logo', logo);*/

// 引入样式
// import '../stylus/index.styl';

// require("html-loader!../html/index.html");

let isIOS = function () {return /iPhone|iPod|iPad/i.test(navigator.userAgent);};
let $chargeBox = $('.charge-box');
let $load = $('.loading');
let $hours = $('.hours');
let $min = $('.minute');
let $sec = $('.second');
let timeOut = {};
// 默认美国mcc
// let mcc = parseQueryString(location.search).mcc || "310";
let mcc = "310";

let leftTime = 0;
let left_time = localStorage.getItem('CHARGE_ACT_LEFT');
if (left_time) {
    leftTime = +left_time + 86400000 - new Date().getTime();
} else {
    leftTime = 86400000;
    localStorage.setItem('CHARGE_ACT_LEFT', new Date().getTime());
}

let _STATUS = leftTime > 0 ? 1 : 0;
let chargeInfo = {};
let chargeInfoStatic = isIOS() ? chargeInfoIOS[mcc] : chargeInfoAndroid[mcc];
console.log('chargeInfoStatic', chargeInfoStatic);
let versionName = 'v1.0.0';

// 活动状态，0为结束，1是进行中

const _TEXT = {
    0 : 'Sorry. This one-time offer is no longer available. Stick with us for more upcoming offers!',
    1 : 'Only 1% of people can enjoy it！<br>' +
    'Purchase coins now and discover more on Dreame.<br>' +
    'Don\'t miss this one-time offer!',
    2 : 'This is an one-time offer and thanks for your purchase.Go and find out more popular books!'
};

try {
    SensorInit();
} catch (err) {
    console.error('sensor-error', err);
}

getActChargeInfo();

let promiseArr = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];

promiseArr.map((item) => {
    console.log(item);
});

$chargeBox.on('click', '.charge-item', function () {
    sendActChargeInfo(chargeInfo[$(this).attr('data-item')],this);
});

$('.loading').on('click',function () {
    close();
});

function SensorInit() {

    trackLogin();

    trackPageView({
        web_url: 'https://api.dreame.com/Act/firstChargePage'
    });
}

function checkStatus() {
    $('.content').html(_TEXT[_STATUS]);
    switch (_STATUS){
        case 0:
            changeTextColor();
            $('.title').addClass('close');
            break;
        case 1:
            timeOut = setTimeout(hourglass,0);
            break;
        case 2:
            $('.title').addClass('success');
            changeTextColor();
            $('.charge-item').addClass('time-out');
            clearTimeout(timeOut);
            break;
    }
}

function dealChargeInfo() {
    for (var i = 0, len = chargeInfo.length; i < len; i++) {
        if (chargeInfo[i].buyed == true) {
            _STATUS = 2;
            continue;
        }
        if ((len - 1) === i) {
            chargeInfo[i].bestTip = 1;
        }
    }

    let tpl = template('charge-item',{
        data : chargeInfo,
        _STATUS : _STATUS
    });

    $chargeBox
        .empty()
        .append(tpl);

    checkStatus();
}

function checkValidVersion(versionName, validVersionName, versionCount) {
    let result;
    let versionArr = versionName.replace('v', '').split(/\./);
    let validVersionArr = validVersionName.replace('v', '').split(/\./);
    if (versionArr.length < versionCount) {
        for (let i = 0, len = versionCount - versionArr.length; i < len; i++) {
            versionArr.push(0);
        }
    }
    if (validVersionArr.length < versionCount) {
        for (let j = 0, len = versionCount - validVersionArr.length; j < len; j++) {
            validVersionArr.push(0);
        }
    }

    for (let x = 0; x < versionCount - 1; x++) {
        if (+versionArr[x] !== +validVersionArr[x]) {
            result = +versionArr[x] > +validVersionArr[x];
            break;
        }
    }

    if (result === undefined) {
        result = +versionArr[versionCount - 1] >= +validVersionArr[versionCount - 1];
    }

    return result;
};

function getActChargeInfo() {

    let isValidVersion = checkValidVersion(versionName, '1.2.2', 3);
    console.log('isValidVersion', isValidVersion);

    if (isValidVersion) {
        show();
        /*JsBridge.getLocalCurrency(chargeInfoStatic, function(res) {
            console.log('getLocalCurrency', res);
            close();
            if (+res.status === 0) {
                chargeInfo = res.dataJson || [];
                dealChargeInfo();
            } else {
                JsBridge.showToast(res.msg || 'get charge info error!');
            }
        });*/
    } else {
        chargeInfo = chargeInfoStatic;
        dealChargeInfo();
    }
}

function sendActChargeInfo(param,el) {
    show();

    if($(el).hasClass('checked')){
        close();
        return console.loe('This is an one time offer and thanks for your purchase.');
    } else if($(el).hasClass('time-out')) {
        close();
        return console.loe('Sorry! This one-time offer is closed.');
    }
    close();
    /*JsBridge.sendChargeInfo(param,function (res) {
        if(res.status == 0){
            JsBridge.showToast('charge success');
            _STATUS = 2;
            clearTimeout(timeOut);
            changeTextColor();
            $(el).addClass('checked');
            $('.charge-item').addClass('time-out');
            checkStatus();
        } else {
            JsBridge.showToast('charge faile!');
        }
    });*/
}

function close() {
    $load.removeClass('show');
}

function show() {
    $load.addClass('show');
}

function hourglass() {
    changeText(getTime(leftTime));
    leftTime = leftTime - 1000;
    if(leftTime < 0){
        $('.charge-item').addClass('time-out');
        return changeTextColor();
    }
    return timeOut = setTimeout(hourglass,1000);
}

function getTime(time) {
    time = time / 1000;
    return {
        hours : numToString(Math.floor(time / 60 / 60),2),
        min: numToString(Math.floor(time / 60 % 60),2),
        sec : numToString(Math.floor(time % 60),2)
    };
}

function changeText(time) {
    $hours.html(time.hours);
    $min.html(time.min);
    $sec.html(time.sec);
}

function changeTextColor(){
    $hours.addClass('finish');
    $min.addClass('finish');
    $sec.addClass('finish');
}

function numToString(int , length){
    var str = int.toString();
    if (str.length < length) {
        for(var i = 0; i < length - str.length; i ++){
            int = '0' + int;
        }
        return int;
    }
    else {
        return str;
    }
}