const {src, dest} = require('gulp');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean-css');
const base64 = require('gulp-base64');

function buildCss(cb) {
    console.log('处理Css');
    
    return src('src/stylus/index.styl')
    .pipe(stylus({
        'include css': true
    }))
    .pipe(autoprefixer())
    .pipe(base64({
        baseDir: 'dist/img',
        extensions: ['svg', 'png', 'jpg', 'gif'],
        exclude:    [/file\.xxx\.cn/], // 排除 cdn 的图片
        maxImageSize: 2 * 1024, // bytes，为了确保css文件按不过大，小于2k的图片才转换
        deleteAfterEncoding: false,
        debug: true
    }))
    .pipe(clean())
    .pipe(dest('dist/css/'));
}

module.exports = buildCss;