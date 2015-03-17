var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var isProd = process.env.NODE_ENV === 'production';

var filename, debug, devtool;
var entry = [
    //'!style!css!less!./styles/loader!',
    './client/main'
];
var plugins = [
    new webpack.DefinePlugin({
        __SPORT__: JSON.stringify('ncaa-mens-basketball'),
        __YEAR__: JSON.stringify('2015')
    }),
    new webpack.optimize.OccurenceOrderPlugin()
];


if (isProd) {
    debug = false;
    filename = 'bundle.[chunkhash].js';
    plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.NoErrorsPlugin()
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
    plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
}


module.exports = {
    debug: debug,
    devtool: devtool,
    entry: entry,
    output: {
        path: './_deploy',
        publicPath: './public',
        filename: filename
    },
    plugins: plugins,
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
            { test: /\.json$/, loaders: ['json'] }
        ]
    }
};