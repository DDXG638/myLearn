const { src, dest } = require('gulp');
const uglify = require('gulp-uglify');
// 处理模块话的插件，实际是node系，获取的文件将是普通Node Stream
const browserify = require("browserify");
// 转成gulp系的二进制stream流
const buffer = require('vinyl-buffer');
// 转成gulp系的stream流
const stream = require('vinyl-source-stream');
const babelify = require('babelify');
const babel = require('gulp-babel');


function buildJs(cb) {
    console.log('处理js');

    return browserify('src/js/index.js')

        // 使用babelify转化ES6代码
        /* .transform('babelify', {
            "presets": [["@babel/preset-env", {
            "useBuiltIns": "usage", // 按需引入
            "corejs": 2
        }]]
        }) */

        /* .transform(babelify.configure({
            "presets": [
                ["@babel/preset-env", {
                    "useBuiltIns": "usage", // 按需引入
                    "corejs": 2
                }]
            ]
        })) */

        .transform(babelify.configure({
            "presets": [
                "@babel/preset-env"
            ],
            "plugins": [
                // 使用 @babel/plugin-transform-runtime
                [
                    "@babel/plugin-transform-runtime", 
                    {
                        // options配置see：https://babeljs.io/docs/en/babel-plugin-transform-runtime
                        "corejs": 2,
                        helpers: false
                    }
                ]
            ]
        }))

        // 生成了Node Stream中的Readable Stream，而Readable Stream有管道方法pipe()
        .bundle()

        // 监听错误
        .on('error', function (error) {
            console.log(error.toString())
        })

        // node系只有content，添加名字转成gulp系可操作的流
        .pipe(stream('index.js'))

        // 转成二进制的流（二进制方式整体传输）
        .pipe(buffer())

        // 压缩处理，gulp-uglify只支持Buffer类型的Vinyl File Object
        .pipe(uglify())

        // 输出
        .pipe(dest('dist/js/'))

    /* return src('src/js/index.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(dest('dist/js/')); */

    // cb();
}

function buildJs2() {
    return src('src/js/index.js')
        .pipe(babel({
            "presets": [["@babel/preset-env", {
                "useBuiltIns": "usage", // 按需引入
                "corejs": 2
            }]]
        }))
        /* .pipe(uglify()) */
        .pipe(dest('dist/js/'));
}

module.exports = buildJs;