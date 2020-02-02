const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
    mode: 'development',
    // entry: './src/pageIndex2.js',
    entry: './src/pageIndexTs.ts',
    output: {
        filename: 'pageIndex.js',
        path: path.resolve(__dirname, 'public/dist/js')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/,
            },
            {
                // 使用babel 
                test: /\.js$/, 
                exclude: /node_modules/, // 忽略依赖中的文件
                use: [
                    {
                        loader: "babel-loader",
                    },
                ]
            }
        ]
    },
    plugins: [
        new CheckerPlugin()
    ]
}
