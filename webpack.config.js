var webpack = require('webpack');
var isProd = process.env.NODE_ENV === 'production';
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HTMLPlugin = require('html-webpack-plugin');

var filename, debug, devtool;
var entry = ['./client/main'];
var publicPath = '/assets/';
var plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
        __SPORT__: JSON.stringify('ncaa-mens-basketball'),
        __YEAR__: JSON.stringify('2015')
    })
];
var loaders = [
    { test: /\.jsx?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
    { test: /\.json$/, loaders: ['json'] }
];


if (isProd) {
    debug = false;
    filename = 'bundle.[hash].js';
    loaders.push({
        test: /.less$/,
        loader: ExtractTextPlugin.extract('style', 'css!less')
    });
    plugins.push(
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new ExtractTextPlugin('bundle.[contenthash].css', {allChunks: true}),
        new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false}
        }),
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: JSON.stringify('production')}
        }),
        new HTMLPlugin({
          template: 'public/prod-index.html',
          publicPath: publicPath
        })
    );
}
else {
    debug = true;
    filename = 'bundle.js';
    devtool = 'eval';
    entry.unshift(
        'webpack-dev-server/client?http://0.0.0.0:3000',
        'webpack/hot/only-dev-server'
    );
}


module.exports = {
    debug: debug,
    devtool: devtool,
    entry: entry,
    output: {
        path: './build',
        publicPath: publicPath,
        filename: filename
    },
    plugins: plugins,
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    },
    module: {
        loaders: loaders
    }
};
