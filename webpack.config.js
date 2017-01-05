var webpack=require('webpack');
var path=require('path');
var http = require('http');
var fs=require("fs");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCss = new ExtractTextPlugin("css/[name].css",{allChunks:true});//这里的参数是配置编译后的css路径和文件名,相对于output里的path选项
var OpenBrowserPlugin = require('open-browser-webpack-plugin');//自动打开浏览器

//配置变量标识

//获取当前运行的模式
var currentTarget=process.env.npm_lifecycle_event;  //获取当前运行的命令

var debug,  //是否是调试
    devServer, //是否是热更新模式
    minimize; //是否需要压缩

if(currentTarget=='build'){ //发布模式
    debug=false;
    devServer=false;
    minimize=true;
} else if(currentTarget=='dev'){ //开发模式
    debug=true;
    devServer=false;
    minimize=false;
}else if(currentTarget=='dev-hrm'){ //热更新模式
    debug=true;
    devServer=true;
    minimize=false;
}

//配置路径（为了方便我们频繁的使用路径）
var PATHS={
    //发布目录
    publicPath:debug?'/assets/js/':'./',

    //公共资源目录
    vendorPath:path.resolve(process.cwd(),'./vendor'),

    //src资源目录
    srcPath:path.resolve(process.cwd(),'src')
}

module.exports= {

    resolve: {
        extensions: ['', '.js'], //决定了哪些文件后缀在引用的时候可以省略点
        fallback: [path.join(__dirname, '../node_modules')], //当webpack在 root（默认当前文件夹，配置时要绝对路径）
                                                             // 和 modulesDirectories（默认当前文件夹，相对路径）
                                                             //配置下面找不到相关modules，去哪个文件夹下找modules
        alias: {  //配置别名（简化操作）在scss之类的css预编译中引用要加上~，以便于让loader识别是别名引用路径
            //js
            jquery: path.join(PATHS.vendorPath, "jquery/jquery.js"),
            director: path.join(PATHS.vendorPath, "director/director.js"),
            knockout: path.join(PATHS.vendorPath, "knockout/knockout-latest.js"),
            uui: path.join(PATHS.vendorPath, "uui/js")
        }
    },

    entry: {
        //入口js
        index: './src/index.js',
        vendor: [
            path.join(PATHS.vendorPath, "jquery/jquery.js"),
            path.join(PATHS.vendorPath, "director/director.js"),
            path.join(PATHS.vendorPath, "knockout/knockout-latest.js"),
            path.join(PATHS.vendorPath, "uui/js/u.js")
        ]
    },

    output: {
        //输出目录
        path: path.resolve(__dirname, './assets/'),

        //发布后，资源引用目录
        publicPath: PATHS.publicPath,

        //文件名称
        filename: '[name]_bundle.js',

        //按需加载模块时输出的名称
        chunkFilename: '/containers/[name].js'
    },

    module: {
        loaders: [
            {test: /\.html$/, loader: "html-loader"},
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/, //过滤掉不需要babel运行的js文件
                // include:__dirname + './src',
                query: {
                    presets: [
                        'es2015'
                    ]
                }
            }, {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract("style-loader", 'css-loader!sass-loader')
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {// 图片 loader
                test: /\.(png|gif|jpe?g)$/,
                loader: 'url-loader',
                query: {
                    /*
                     *  limit=10000 ： 10kb
                     *  图片大小小于10kb 采用内联的形式，否则输出图片
                     * */
                    limit: 10000,
                    name: '/img/[name]-[hash:8].[ext]'
                }
            },
            {// 字体loader
                test: /\.(eot|woff|woff2|ttf|svg)\??.*$/,
                loader: 'url-loader',
                query: {
                    limit: 5000,
                    name: '/font/[name]-[hash:8].[ext]'
                }
            },
        ]
    },

    sassLoader: {
        includePaths: [path.resolve(__dirname, './assets/css')]
    },

    devServer: {
        contentBase: './',//指定本地文件夹提供给服务器
        colors: true, //设置为true,是终端输出的文件为彩色
        historyApiFallback: true, //如果设置为true,所有的跳转将指向index.html
        inline: true,
        hot: true,
        host: "localhost",
        port: '3000', //设置默认监听端口，如果省略，默认为‘8080’
        proxy: {
            // proxy all requests starting with /api to jsonplaceholder
            '/api': {
                target: 'http://localhost:8888/',
                changeOrigin: true, //接收一个布尔值，如果设置为true,那么本地会虚拟一个服务端接收你的请求并代你发送该请求
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },

    devtool: 'eval-source-map',  //这样出错以后就会采用source-map的形式直接显示你出错代码的位置。

    plugins: [
        /*  这步是为了提取共有样式，从index块中删除所有在vendor 块中的模块
         使index_chunk.js现在只包含你的应用代码，而没有其他依赖 更专注与自己的业务逻辑*/
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),

        //html模板插件，使得模板可以自动加上js和css的依赖文件
        new HtmlWebpackPlugin({inject: true, template: __dirname + '/src/index.html'}),

        new webpack.HotModuleReplacementPlugin({
            multiStep: true
        }),

        // 分离css
        extractCss,
        new OpenBrowserPlugin({url: 'http://localhost:3000' + PATHS.publicPath + 'index.html'}),  //自动打开浏览器
        new webpack.ProvidePlugin({  //提供全局变量
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            ko: "knockout"
        })
    ]
}



    //node模拟后端服务
    var srv = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
         console.log(__dirname +"/moke/api" + req.url);
        fs.readFile(__dirname +"/moke/api" + req.url,'utf-8',function(err,data){
            if(err){
                console.log(err);
            }else{
                res.end(data);
            }
        })
    });
    srv.listen(8888, function() {
        console.log('listening on localhost:8888');
    });
