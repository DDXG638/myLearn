
var fs = require("fs"),
	stdin = process.stdin,
	stdout = process.stdout,
	stats = [];
fs.readdir(process.cwd(), function (err, files) {
	console.log('');

	if (!files.length) {
		return console.log('\033[31m 文件夹是空的 \033[39m \n');
	}

	console.log('请选择文件或者目录\n');

	function file (i) {
		var fileNmae = files[i];

		fs.stat(__dirname + '/' + fileNmae, function (err, stat) {
			stats[i] = stat;

			if (stat.isDirectory()) {
				console.log('    ' + i + '\033[36m' + fileNmae + '/\033[39m');
			} else {
				console.log('    ' + i + '\033[90m' + fileNmae + '\033[39m');
			}

			i++;

			if (i == files.length) {
				read();
			} else {
				file(i);
			}
		});
	}

	function read () {
		console.log('');

		stdout.write('    \033[33m请输入你的选择：\033[39m');
		stdin.resume();
		stdin.setEncoding('utf8');

		stdin.on('data', option);
	}

	function option (data) {
		var fileName = files[Number(data)];
		if (!fileName) {
			stdout.write('    \033[33m请输入你的选择：\033[39m');
		} else {
			stdin.pause();

			if (stats[Number(data)].isDirectory()) {
				fs.readdir(__dirname + '/' + fileName, function (err, files) {
					console.log('');
					console.log('    (' + files.length + 'files)');
					files.forEach(function (file) {
						console.log('    -   ' + file);
					});
					console.log('');
				});
			} else {
				fs.readFile(__dirname + '/' + fileName, 'utf8', function (err, data) {
					console.log('');
					console.log('\033[90m' + data.replace(/(.*)/g, '    $1') + '\033[39m');
				});
			}

			
		}
	}

	file(0);

});
