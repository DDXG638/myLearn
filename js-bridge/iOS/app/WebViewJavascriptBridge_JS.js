// This file contains the source for the Javascript side of the
// WebViewJavascriptBridge. It is plaintext, but converted to an NSString
// via some preprocessor tricks.
//
// Previous implementations of WebViewJavascriptBridge loaded the javascript source
// from a resource. This worked fine for app developers, but library developers who
// included the bridge into their library, awkwardly had to ask consumers of their
// library to include the resource, violating their encapsulation. By including the
// Javascript as a string resource, the encapsulation of the library is maintained.

// IOS app内保留的文件
// see: https://github.com/marcuswestin/WebViewJavascriptBridge/blob/master/WebViewJavascriptBridge/WebViewJavascriptBridge_JS.m
// 我们可以在OC中调用javascript方法，但是反过来不能在javascript中调用OC方法。
// 这个文件是javascript环境的bridge初始化和处理，负责接收app发给javascript的消息，并且把javascript环境的消息发送给app。

(function() {
	if (window.WebViewJavascriptBridge) {
		return;
	}

	if (!window.onerror) {
		window.onerror = function(msg, url, line) {
			console.log("WebViewJavascriptBridge: ERROR:" + msg + "@" + url + ":" + line);
		}
	}

	// 在全局定义window.WebViewJavascriptBridge对象，供H5调用
	window.WebViewJavascriptBridge = {
		registerHandler: registerHandler, // 注册事件，H5调用
		callHandler: callHandler, // 执行事件，H5调用
		disableJavscriptAlertBoxSafetyTimeout: disableJavscriptAlertBoxSafetyTimeout, // 设置 与app通信 不需要需要延迟
		_fetchQueue: _fetchQueue, // 获取存储事件数据队列json字符串，app调用
		_handleMessageFromObjC: _handleMessageFromObjC // app调用JS的入口方法，app调用
	};

	var messagingIframe;
	// 存储事件数据（cmd + data）
	var sendMessageQueue = [];
	// 存储注册事件
	var messageHandlers = {};
	
	var CUSTOM_PROTOCOL_SCHEME = 'https';
	var QUEUE_HAS_MESSAGE = '__wvjb_queue_message__';
	
	// 存储H5传过来的回调函数，callbackId为key
	var responseCallbacks = {};
	var uniqueId = 1;
	// 与app通信是否需要延迟，默认需要延迟
	var dispatchMessagesWithTimeoutSafety = true;

	/**
	 * 注册事件，app触发，app主动触发回调，像pageActive/onresume 这种webview页面激活（回到app最上层）回调，
	 * bridge.registerHandler(cmd, callback)
	 * @param {String} handlerName cmdName
	 * @param {Function} handler H5传入的回调函数
	 */
	function registerHandler(handlerName, handler) {
		messageHandlers[handlerName] = handler;
	}
	
	/**
	 * 执行事件，H5触发，app响应。bridge.callHandler(cmd, ...params, callback)
	 * @param {String} handlerName cmdName
	 * @param {Object} data H5传递的参数
	 * @param {Function} responseCallback app处理完之后执行的回调
	 */
	function callHandler(handlerName, data, responseCallback) {
		// 一般规定将回调函数放在参数列表的最后面
		if (arguments.length == 2 && typeof data == 'function') {
			responseCallback = data;
			data = null;
		}

		// 执行操作
		_doSend({ handlerName:handlerName, data:data }, responseCallback);
	}

	// 设置 与app通信 不需要需要延迟
	function disableJavscriptAlertBoxSafetyTimeout() {
		dispatchMessagesWithTimeoutSafety = false;
	}
	
	/**
	 * js 给 app 发送消息
	 * @param {Object} message 事件数据，{ handlerName:handlerName, data:data }，cmd + data
	 * @param {Function} responseCallback H5传过来的回调函数
	 */
	function _doSend(message, responseCallback) {
		if (responseCallback) {
			var callbackId = 'cb_'+(uniqueId++)+'_'+new Date().getTime();
			// 存储responseCallback回调函数
			responseCallbacks[callbackId] = responseCallback;
			// 给message多加一个callbackId属性，message事件数据的id 和 回调函数的id是一致的，这方便app处理完之后执行回调函数
			message['callbackId'] = callbackId;
		}
		// 存储 事件数据
		sendMessageQueue.push(message);
		// 与app通信的方式，会触发decidePolicyForNavigationAction  webview跳转代理。
		// 简单的讲就是app会监控下面连接的跳转，当检测到这个跳转app就知道是H5给app传递了消息事件（调用了callHandler方法），
		// app就会通过全局_fetchQueue和_handleMessageFromObjC方法处理事件。因为app是可以通过window.WebViewJavascriptBridge调用js方法的。
		messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
	}

	/**
	 * 获取当前的所有事件数据
	 */
	function _fetchQueue() {
		var messageQueueString = JSON.stringify(sendMessageQueue);
		// 清空
		sendMessageQueue = [];
		return messageQueueString;
	}

	// app 给 js 通信，处理从app返回的消息
	function _dispatchMessageFromObjC(messageJSON) {
		if (dispatchMessagesWithTimeoutSafety) {
			setTimeout(_doDispatchMessageFromObjC);
		} else {
			 _doDispatchMessageFromObjC();
		}
		
		function _doDispatchMessageFromObjC() {

			// message = { handlerName, data, callbackId }
			var message = JSON.parse(messageJSON);
			var messageHandler;
			var responseCallback;

			// 如果app返回的数据有responseId说明app已经处理好了这个事件
			// 可能是通过callHandler方法的事件 也可能是 registerHandler方法的注册事件
			if (message.responseId) {
				responseCallback = responseCallbacks[message.responseId];
				if (!responseCallback) {
					return;
				}
				// 直接执行回调
				responseCallback(message.responseData);
				// 执行完后删除回调队列中的方法
				delete responseCallbacks[message.responseId];
			} else {
				if (message.callbackId) {
					var callbackResponseId = message.callbackId;
					responseCallback = function(responseData) {
						_doSend({ handlerName:message.handlerName, responseId:callbackResponseId, responseData:responseData });
					};
				}
				
				// 处理注册事件
				var handler = messageHandlers[message.handlerName];
				if (!handler) {
					console.log("WebViewJavascriptBridge: WARNING: no handler for message from ObjC:", message);
				} else {
					handler(message.data, responseCallback);
				}
			}
		}
	}
	
	function _handleMessageFromObjC(messageJSON) {
        _dispatchMessageFromObjC(messageJSON);
	}

	// 创建iframe，这个才是与app底层
	messagingIframe = document.createElement('iframe');
	messagingIframe.style.display = 'none';
	messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
	document.documentElement.appendChild(messagingIframe);

	// 手动触发一个注册事件，如果有回调则说明 与app通信不需要延迟
	registerHandler("_disableJavascriptAlertBoxSafetyTimeout", disableJavscriptAlertBoxSafetyTimeout);
	
	setTimeout(_callWVJBCallbacks, 0);
	
	function _callWVJBCallbacks() {
		// window.WVJBCallbacks 是一个事件队列
		/**
		 * window.WebViewJavascriptBridge没有准备好的时候，
		 * 但是又调用了 H5中封装的 _call 或者 _register方法，
		 * 就会将这些事件存储到window.WVJBCallbacks 事件队列中，
		 * 等到window.WebViewJavascriptBridge准备好之后再执行。
		 * 
		 * 简单的说就是在window.WebViewJavascriptBridge没有挂载之前将调用了的js-bridge方法暂时存储到一个队列中，
		 * 等挂载好了之后再一次性执行。
		 */

		var callbacks = window.WVJBCallbacks;
		// TODO，为什么要删除它呢？？？
		delete window.WVJBCallbacks;
		for (var i=0; i<callbacks.length; i++) {
			callbacks[i](WebViewJavascriptBridge);
		}
	}
})();
