const { series, parallel } = require('gulp');
const cache = require('gulp-cache');

const buildJs =  require('./buildJs');
const buildImg = require('./buildImg');
const buildCss = require('./buildCss');
const buildHtml = require('./buildHtml');

function build(cb) {
  // body omitted
  console.log('build');
  cb();
}

function clearImgCache(cb) {
  cache.clearAll();
  cb();
}

exports.clearImgCache = clearImgCache;
exports.build = series(parallel(buildJs, series(buildImg, buildCss)), buildHtml);