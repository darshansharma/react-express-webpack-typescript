var path = require('path');
var autoprefixer = require('autoprefixer');
var nodeExternals = require('webpack-node-externals');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: path.resolve("routes.tsx"),
    output: {
        path: path.resolve("dist"),
        publicPath: "/",
        filename: "bundle.js",
        chunkFilename: "[name].[chunkhash].chunk.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/, use: { loader: 'awesome-typescript-loader' },
                exclude: /node_modules/,
            },
            {
                enforce: "pre",
                test: /\.js$/, loader: "source-map-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.html$/,
                use: "html-loader",
            },
            {
                test: /\.(jpeg|png|gif|svg|jpg)$/,
                loader: "url-loader",
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    mode: "development",
    devtool: "source-map",
    plugins: [new HtmlWebpackPlugin({
            inject: true,
            template: path.join(process.cwd(), "index.html"),
        })]
};
