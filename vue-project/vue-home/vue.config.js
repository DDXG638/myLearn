module.exports = {
    devServer: {
        host: 'dev.dreame.com',
        port: 8066
    },
    productionSourceMap: false,
    pages: {
        index: {
            // page 的入口
            entry: 'src/pages/index/main.js',
            // 模板来源
            template: 'src/pages/index/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            chunks: ['chunk-vendors', 'index']
        },
        task: {
            // page 的入口
            entry: 'src/pages/task/main.js',
            // 模板来源
            template: 'src/pages/task/index.html',
            // 在 dist/index.html 的输出
            filename: 'task.html',
            chunks: ['chunk-vendors', 'task']
        }
    },
    configureWebpack: {
        output: {
            filename: 'js/[name].js?hash=[hash]',
            chunkFilename: 'js/[name].js?hash=[chunkhash]',
        }
    },
    chainWebpack: config => {
        config.optimization.splitChunks({
            cacheGroups: {
                vendors: {
                    name: 'chunk-vendors',
                    minChunks: 2,
                    chunks: 'initial'
                }
            }
        });

        config.module
            .rule('stylus')
            .oneOf('vue')
            .use('px2rem-loader')
            .loader('px2rem-loader')
            .before('postcss-loader') // this makes it work.
            .options({ remUnit: 100, remPrecision: 8 })
            .end()
    },
    css: {
        extract: {
            filename: 'css/[name].css?hash=[contenthash]',
            chunkFilename: 'css/[name].css?hash=[contenthash]'
        },
        /*loaderOptions: {
            postcss: {
                plugins: [require('postcss-px2rem')({
                    remUnit: 100
                })]
            }
        }*/
    },
}