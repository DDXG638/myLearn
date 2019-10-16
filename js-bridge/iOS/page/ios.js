const setCookie = require('hy-libs/setCookie');
const parseCallArguments = require('../_utils/parseCallArguments');

const JS_BRIDGE_NAME = 'WebViewJavascriptBridge';
const MESSAGE_QUEUE_NAME = 'WVJBCallbacks';

function _init(bridge) {
    if (bridge.init) {
        bridge.init();
        delete bridge.init;
    }
}

function _run(callback) {
    let _callback = function (bridge) {
        _init(bridge);
        callback(bridge);
    };

    // window.WebViewJavascriptBridge对象是 客户端 注入到webview的window全局环境中的
    if (window[JS_BRIDGE_NAME]) {
        _callback(window[JS_BRIDGE_NAME]);
    }
    else {
        // window.WVJBCallbacks 是事件队列
        if (window[MESSAGE_QUEUE_NAME]) {
            window[MESSAGE_QUEUE_NAME].push(_callback);
        } else {
            // 在window.WebViewJavascriptBridge没有挂载之前将调用了的js-bridge方法暂时存储到一个队列中
            window[MESSAGE_QUEUE_NAME] = [_callback];
            /**
             * 这个iframe的作用是 加载并执行 保存在app端的WebViewJavascriptBridge_JS.js文件中的代码
             */
            let WVJBIframe = document.createElement('iframe');
            WVJBIframe.style.display = 'none';
            WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
            document.documentElement.appendChild(WVJBIframe);
            setTimeout(function () {
                document.documentElement.removeChild(WVJBIframe);
            }, 0);
        }
    }
}

/**
 * _call(cmd, ...params, callback)
 * @private
 */
function _call() {
    /**
     * cmd：web端与app端定好的实现功能的名字，如：cmd=login，web端调用之后app就会处理登陆逻辑
     * params：web端传给app端的参数
     * callback：这个方法回来之后web端要执行的逻辑
     */
    let [cmd, params, callback] = parseCallArguments(arguments);

    // 这个bridge就是window.WebViewJavascriptBridge，这里使用里面的callHandler方法
    _run(bridge => {
        bridge.callHandler(cmd, ...params, callback);
    });
}

/**
 *
 * @param cmd
 * @param callback
 * @private
 */
function _register(cmd, callback) {
    _run(bridge => {
        bridge.registerHandler(cmd, callback);
    });
}

/**
 * iOS 主动添加cookie
 */
_register('addCookie', data => {
    for (let key in data) {
        if (data[key]) {
            setCookie(key, data[key], {
                domain: location.hostname,
                path: '/',
                expires: 365
            });
        }
    }
});

module.exports = {
    _call,
    _register
};