const parseCallArguments = require('../_utils/parseCallArguments');

const JS_BRIDGE_NAME = 'WebViewJavascriptBridge';

/**
 * @param fn
 * @private
 */
function _run(fn) {
    if (window[JS_BRIDGE_NAME]) {
        fn(window[JS_BRIDGE_NAME]);
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function () {
            fn(window[JS_BRIDGE_NAME]);
        }, false);
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
 * _register(cmd, callback)
 * @param cmd
 * @param callback
 * @private
 */
function _register(cmd, callback) {
    _run(bridge => {
        bridge.registerHandler(cmd, callback);
    });
}

module.exports = {
    _call,
    _register
};