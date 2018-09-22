var http = require('http'),
	fs = require('fs'),
	url = require('url');

var server = http.createServer(function (req, res) {
	
	var params = url.parse(req.url, true).query;
	var pathname = url.parse(req.url, true).pathname;
	var data = {
		name: 'ddxg',
		age: 22
	};
	console.log(pathname);
	if (pathname === '/') {
		res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
		fs.createReadStream(__dirname + '/index.html').pipe(res);
	} 
	// 正常
	else if (pathname === '/getInfo') {
		console.log(req.url);
		res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
        res.end(JSON.stringify(data));
	}
	// jsonp方式
	else if (pathname === '/getInfo2') {
		var callbackName = params.callback;
		console.log(req.url);
		res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
		res.end(callbackName+'(' + JSON.stringify(data) + ')');
	} 
	// CORS方式
	else if (pathname === '/getInfo3') {
		console.log(req);
		//console.log(req.headers);
		res.writeHead(200, {
			'Content-Type': 'application/json;charset=utf-8',
			'Access-Control-Allow-Origin': req.headers.origin,
			'Access-Control-Allow-Credentials': true
		});
		res.end(JSON.stringify(data));
	} 
	else {
		res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
        res.end(JSON.stringify({name: 'ooo', age: 12}));
	}

});

server.listen(4000);
