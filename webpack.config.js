/* eslint-env node */

'use strict';

const path = require('path');
const cssnano = require('cssnano');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackConfig = require('hjs-webpack');
const minify = require('html-tagged-literals').minify;
const _ = require('lodash');
const config = require('getconfig');

const isDev = config.getconfig.isDev;
const define = _(config)
  .pick('year', 'sport', 'events', 'mock', 'ga')
  .transform((res, val, key) => res[`__${key.toUpperCase()}__`] = JSON.stringify(val))
  .value();

const renderHTML = (context) => minify`
  <!DOCTYPE html>
  <html>
  <head>
    <title>Tweet Your Bracket</title>
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <link rel="stylesheet" href="/${context.css}">
  </head>
  <body>
    <div id='root'></div>
    <script>window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,"script","twitter-wjs"));</script>
    <script src="/${context.main}"></script>
  </body>
  </html>
`;

const webpack = webpackConfig({
  isDev,
  define,
  'in': 'src/main.js',
  out: 'build',
  clearBeforeBuild: true,
  output: {hash: true},
  hostname: 'localhost',
  devServer: {contentBase: 'public'},
  replace: {
    config: `src/config/${isDev ? 'development' : 'production'}.js`
  },
  html: (context) => ({
    [isDev ? 'index.html' : '200.html']: renderHTML(context)
  })
});

const replaceLoader = (loader, replacer) => (l) => {
  const match = new RegExp(`(^|!)(${loader}-loader)($|!)`);
  if (l && l.loader && l.loader.match(match)) {
    l.loader = l.loader.replace(match, replacer);
  }
};

// debuggable selectors in dev, super compact selectors in prod
const cssDevIdent = isDev ? '[path][name]___[local]___' : '';
const cssModulesLoader = `?modules&localIdentName=${cssDevIdent}[hash:base64:5]`;
webpack.module.loaders.forEach(replaceLoader('css', `$1$2${cssModulesLoader}$3`));

// Custom extension for the js file that builds bootstrap+theme which requires
// the loaders to start with val-loader, but doesn't mess with other css/less loaders
webpack.module.loaders.unshift({
  test: /\.js2less$/,
  loader: isDev
    ? 'style-loader!css-loader!postcss-loader!less-loader!val-loader'
    : ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader!val-loader')
});

webpack.postcss.push(cssnano({
  // Required to work with relative Common JS style urls for css-modules
  normalizeUrl: false,
  // Core is on by default so disabling it for dev allows for more readable
  // css since it retains whitespace and bracket newlines
  core: !isDev,
  discardComments: {removeAll: !isDev}
}));

// Allow for src/lib files to be required without relative paths
webpack.resolve.alias = {
  lib: path.resolve(__dirname, 'src', 'lib')
};

module.exports = webpack;
