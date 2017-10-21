var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    //watch: true,
    cache: true,
    entry: {
        Vendor: "./clientapp/infrastructure/vendor.ts",
        App: './clientapp'
    },
    output: {
        path: path.join(__dirname, "/wwwroot/app"),
        filename: "SpaApp.[name].js",
        chunkFilename: 'chunks/[name].chunk.js',
        libraryTarget: 'umd',
        library: ['SpaApp', "[name]"],
        publicPath: '/app/'
    },
    resolve: {
        extensions: ['.ts', '.js', '.webpack.js', '.web.js'],
        alias: {
            'handlebars': 'handlebars/runtime.js'
        }
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: ['ts-loader'],
            exclude: /node_modules/
        },
        {
            test: /\.scss$/,
            use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader',
                    options: {
                        includePaths: [
                            path.resolve(__dirname, 'node_modules'),
                            path.resolve(__dirname, 'node_modules/@material/*')]
                    }
                }
                ]
            }))
        },
        {
            test: /\.css$/,
            use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: 'css-loader'
            }))
        },
        {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'file-loader',
            exclude: /node_modules/
        },
        {
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            loader: 'file-loader?name=fonts/[name].[ext]'
        },
        {
            test: require.resolve("jquery"),
            loader: "expose-loader?$!expose-loader?jQuery"
        },
        {
            test: require.resolve("material-components-web"),
            loader: "expose-loader?mdc"
        },
        {
            test: /\.handlebars$/,
            loader: "handlebars-loader"
        }
        ]
    },
    plugins: [
        //new webpack.ProvidePlugin({
        //    $: "jquery",
        //    jQuery: "jquery",
        //    "window.jQuery": "jquery"
        //}),
        //new webpack.HotModuleReplacementPlugin(),
        //new webpack.NoEmitOnErrorsPlugin(),
        //new webpack.NamedModulesPlugin(),
        new ExtractTextPlugin('style.css'),
        new webpack.LoaderOptionsPlugin({
            debug: true,
            minimize: true
        })
    ]
};