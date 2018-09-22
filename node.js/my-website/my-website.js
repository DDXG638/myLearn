var http = require('http'),
	fs = require('fs');

var server = http.createServer(function (req, res) {
	if (req.method == 'GET') {
		res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
		fs.createReadStream(__dirname + req.url).pipe(res);
	} else {
		res.writeHead(404);
		res.end('404 NOT FOUND');
	}
});

server.listen(3000);
