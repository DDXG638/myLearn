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
    let [cmd, params, callback] = parseCallArguments(arguments);

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