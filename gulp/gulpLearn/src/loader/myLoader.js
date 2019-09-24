const loaderUtils = require('loader-utils');

/**
 * content: 一般是源码
 * map 和 meta 为可选项
 * see: https://www.webpackjs.com/api/loaders/
 */
module.exports = function(content, map, meta) {
    // 函数的 this 上下文将由 webpack 填充，有很多api
    // 如果这个 loader 配置了 options 对象的话，this.query 就指向这个 option 对象
    console.log('query', this.query);

    // 获取复杂参数的话可以使用官方推荐的loader-utils
    // see：https://github.com/webpack/loader-utils#getoptions
    const options = loaderUtils.getOptions(this);
    
    // return content + `console.log('${this.query.name}')`;

    // 除了直接return之外，也可以使用this.callback来返回多个结果
    /* const ret = content + `console.log('${options.name}')`;
    this.callback(null, ret); */

    // 异步操作，告诉 loader-runner 这个 loader 将会异步地回调。返回 this.callback。
    const callback = this.async();

    setTimeout(function() {
        const ret = content + `console.log('${options.name}')`;
        callback(null, ret)
    }, 2000);

};