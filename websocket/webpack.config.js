const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
    mode: 'development',
    entry: './src/pageIndex2.js',
    // entry: './src/pageIndexTs.ts',
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
                // 使用babel 处理 ts
                test: /\.(js|tsx?)$/, 
                exclude: /node_modules/, // 忽略依赖中的文件
                use: [
                    {
                        loader: "babel-loader",
                    },
                ]
            },
            // ts 的 webpack loader对ts进行处理，也可以使用babel的preset处理ts
            // {
            //     test: /\.ts?$/,
            //     loader: 'awesome-typescript-loader',
            //     exclude: /node_modules/,
            // },
        ]
    },
    plugins: [
        // new CheckerPlugin()
    ]
}
