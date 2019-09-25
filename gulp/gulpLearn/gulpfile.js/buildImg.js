const {src, dest} = require('gulp');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');

function buildImg(cb) {
    console.log('处理img');
    return src('src/img/*.{jpg,png,gif,svg}')
    .pipe(cache(
        imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]), {
            name: 'gulp-img'
        }))
    .pipe(dest('dist/img/'));
}

module.exports = buildImg;