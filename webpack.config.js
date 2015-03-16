var webpack = require('webpack');

var isProd = process.env.NODE_ENV === 'production';

var entry = [];
var filename = 'bundle.js';
var plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
        __SPORT__: JSON.stringify('ncaa-mens-basketball'),
        __YEAR__: JSON.stringify('2015')
    }),
    new webpack.optimize.OccurenceOrderPlugin()
];


if (isProd) {
    filename = 'bundle.[hash].js';
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
    entry.push(
        'webpack-dev-server/client?http://0.0.0.0:3000',
        'webpack/hot/only-dev-server'
    );
}


module.exports = {
    devtool: 'eval',
    entry: entry.concat('./client/main'),
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
            { test: /\.json?$/, loaders: ['json'] }
        ]
    }
};