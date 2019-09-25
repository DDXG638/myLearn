const {src, dest} = require('gulp');
const inlinesource = require('gulp-inline-source');

function buildHtml(cb) {
    console.log('处理html');
    
    return src('src/html/index.html')
    .pipe(inlinesource())
    .pipe(dest('dist/html/'));
}

module.exports = buildHtml;