var http = require('http'),
    fs = require('fs'),
    url = require('url');

var server = http.createServer(function (req, res) {

    var params = url.parse(req.url, true).query;
    var pathname = url.parse(req.url, true).pathname;

    console.log(pathname);
    if (pathname === '/format/index') {
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        fs.createReadStream(__dirname + '/public/formats/html/parseXML.html').pipe(res);
    }
    else if (pathname === '/format/getXml') {
        var fileName = __dirname + '/public/formats/verbose_xml_1000.xml';
        if (+params.type === 2) {
            fileName = __dirname + '/public/formats/simple_xml_1000.xml';
        }
        res.writeHead(200, {'Content-Type': 'xml;charset=utf-8'});
        fs.createReadStream(fileName).pipe(res);
    }
    else if (pathname === '/format/getJson') {
        res.writeHead(200, {'Content-Type': 'application/javascript;charset=utf-8'});
        fs.createReadStream(__dirname + '/public/formats/verbose_json_1000.js').pipe(res);
    }
    else if (pathname === '/format/getJsonp') {
        var callbackName = params.callback;
        var data = '';
        res.writeHead(200, {'Content-Type': 'application/javascript;charset=utf-8'});
        let readerStream = fs.createReadStream(__dirname + '/public/formats/verbose_json_1000.js');
        readerStream.on('data', function (chunk) {
            data += chunk;
        });

        readerStream.on('end', function (chunk) {
            res.end('var fff = new Date().getTime();' + callbackName+'(' + data + ');console.log(new Date().getTime() - fff);');
        });

    }
    else if (pathname === '/format/custom') {
        res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
        fs.createReadStream(__dirname + '/public/formats/custom_1000.txt').pipe(res);
    }
    else {
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        fs.createReadStream(__dirname + req.url).pipe(res);
    }

});

server.listen(4096);
