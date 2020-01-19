const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/pageIndex2.js',
    output: {
        filename: 'pageIndex.js',
        path: path.resolve(__dirname, 'public/dist/js')
    }
};