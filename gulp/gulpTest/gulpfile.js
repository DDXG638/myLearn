const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const path = require('path');

gulp.task('build', function(done) {

    /*gulp.src('src/js/index.js')
        .pipe(gulp.dest('dist/'));*/

    browserify('src/js/index.js')
        .transform(babelify.configure({
            presets: [
                ['env'],
                ['stage-2']
            ]
        }), {global: true})
        .bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        /* .pipe(uglify()) */
        .pipe(gulp.dest('dist/'));

    done();
});

// https://www.cnblogs.com/yxy99/p/5068121.html
// https://www.cnblogs.com/jesy/p/5192815.html
// https://www.cnblogs.com/2050/p/4198792.html