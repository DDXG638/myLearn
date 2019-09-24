const { series } = require('gulp');

const buildJs =  require('./buildJs');
const buildImg = require('./buildImg');
const buildCss = require('./buildCss');
const buildHtml = require('./buildHtml');

function build(cb) {
  // body omitted
  console.log('build');
  cb();
}

exports.build = series(buildJs, buildImg, buildCss, buildHtml);