const path = require('path');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css的插件
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin'); // js和css内联进html的插件

module.exports = {
    entry: './src/js/index.js',
    mode: 'development',
    devtool: 'none',
    devServer: {
        contentBase: path.join(__dirname, "dist"), // 告诉服务器从哪里提供内容。一般就是你的html文件的目录
        compress: true, // 一切服务都启用gzip 压缩
        port: 9000 // 配置端口
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'index.js'
    },
    module: {
        rules: [
            /*{
                // 处理静态资源A
                // 正则匹配需要用这个loader的文件
                test: /\.(png|jp?g|gif)$/,
                use: [
                    {
                        // 指定要使用的是那个loader
                        loader: 'file-loader',
                        options: {
                            // 配置文件输出的名字
                            name: '[name].[ext]',
                            // 指定在输出的路径，相对以output.path
                            outputPath: 'img/'
                        }
                    }
                ]
            },*/
            {
                // 使用url-loader
                test: /\.(png|jp?g|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 图片大小低于1024B就转为base64
                            limit: 1024,
                            // 指定png格式的文件才转
                            mimetype: 'image/png',
                            // 配置文件输出的名字
                            name: '[name].[ext]',
                            // 指定在输出的路径，相对以output.path
                            outputPath: '../img/'
                        }
                    }
                ]
            },
            {
                // 处理样式，使用了stylus的预处理器
                test: /\.styl$/,
                /*
                * 引入的顺序是有区别的，use数组中的顺序是从后往前的，执行的顺序是倒过来的。
                * postcss-loader：Use it after css-loader and style-loader, but before other preprocessor loaders like e.g sass|less|stylus-loader, if you use any.
                * */
                /*use: ExtractTextPlugin.extract({
                    // fallback: "style-loader",
                    use: ['css-loader', 'postcss-loader', 'stylus-loader']
                })*/

                /**
                 * 这种打包方式是将css引入js中的，是通过style-loader的作用将css插入到head中的，这样子会有一个时间差，会闪现一下无样式的状态，体验非常不好。
                 */
                /*use: [
                    'style-loader', // 会把css-loader生成的内容，以<style> 标签添加到html的head中
                    'css-loader', // 解释(interpret) @import 和 url()
                    'postcss-loader',
                    'stylus-loader'
                ]*/


                /*
                * 分离css
                * */
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development'
                        }
                    },
                    /* {
                        loader: 'file-loader',
                        options: {
                            name: '[name].css',
                            outputPath: '../css/'
                        }
                    },
                    'extract-loader', */
                    'css-loader', // 解释(interpret) @import 和 url()
                    'postcss-loader',
                    'stylus-loader'
                ]
            },
            /* {
                // 使用html-loader分离html
                test: /\.html$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: '../'
                        }
                    },
                    'extract-loader',
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true,
                            removeComments: false,
                            collapseWhitespace: false
                        }
                    }
                ],
            }, */

            {
                // 使用babel 
                test: /\.js$/, 
                exclude: /node_modules/, // 忽略依赖中的文件
                use: [
                    {
                        loader: "babel-loader",
                        // 配置写在独立的.babelrc
                        // options: {
                        //     presets: ["@babel/preset-env"]
                        // }
                    }
                ]
            }
        ]
    },
    plugins: [
        /*
        * extract-text-webpack-plugin 目前不支持webpack4.x的版本，使用beta版本可以work，但是不支持生成hash文件名
        * 改用mini-css-extract-plugin
        * */
        // 传入extract-text-webpack-plugin的选项
        // new ExtractTextPlugin('index.css')

        new MiniCssExtractPlugin({
            filename: '../css/index.css',
            chunkFilename: "[id].css"
        }),

        // 使用插件分离html
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: 'src/html/index.html',
            inlineSource: '.(js|css)$'
        }),
        
        // 将js和css内联进html的插件，编译有问题，暂时无法解决
        // new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin)
    ]
}