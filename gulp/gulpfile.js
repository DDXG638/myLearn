var path = require('path');
var glob   = require('glob');

var gulp   = require('gulp');
var stylus = require('gulp-stylus');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');

var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var idify = require('hy-gulp-require-idify');

gulp.task('stylus', function() {
    glob('stylus/**/index.styl', function(err, files) {
        files.forEach(function(file) {
            var match = /^stylus\/([a-z0-9\-_\.]+)/ig.exec(file);
            
            if (match) {
                var filename = match[1];
                
                console.log(file, filename);
                
                if (filename == 'ui') {
                    gulp.src(['node_modules/normalize.css/normalize.css', file])
                        .pipe(plumber())
                        .pipe(stylus())
                        .pipe(autoprefixer({
                            remove: false
                        }))
                        .pipe(concat(filename + '.css'))
                        .pipe(gulp.dest('../../www/pc/style2'));
                }
                else {
                    gulp.src(file)
                        .pipe(plumber())
                        .pipe(stylus())
                        .pipe(autoprefixer({
                            remove: false
                        }))
                        .pipe(rename(filename + '.css'))
                        .pipe(gulp.dest('../../www/pc/style2'));
                }
            }
        });
    });
});

gulp.task('javascript', function(done) {
    glob('js/**/*.js', function (err, files) {

        files.forEach(function(file) {
            var match = /^js\/([a-z0-9\-_\.]+)/ig.exec(file);

            if (match) {
                var filename = match[1];

                es52es6(file, filename);
            }
        });

    });
});

var babel = {
    presets: [
        ['env'],
        ['stage-2']
    ],
        plugins: [
        ['transform-runtime', {
            helpers: false,
            polyfill: false,
            moduleName: 'babel-runtime'
        }]
    ]
};

function es52es6(file, filename) {
    //files.forEach(function (file) {
        /*return new Promise(function (resolve) {*/
            browserify(file)
                .transform(babelify.configure(babel), {global: true})
                .bundle()
                .pipe(source(path.basename(file)))
                .pipe(buffer())
                .pipe(idify())
                .pipe(gulp.dest('../../www/pc/js2/' + filename + '/'));
                /*.on('end', resolve);*/
        /*});*/
    //});

    /*var _done = function() { return done();};

    Promise.all(tasks).then(_done).catch(_done);*/
}

gulp.task('watch', ['stylus'], function () {
    gulp.watch('stylus/**/*.styl', {interval: 50}, ['stylus'])
        .on('change', function () {
            console.log('detected stylus files changed');
        });
});
