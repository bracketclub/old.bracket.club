'use strict';

const path = require('path');
const cssnano = require('cssnano');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OnBuildPlugin = require('on-build-webpack');
const webpackConfig = require('hjs-webpack');
const html = require('html-tagged-literals');
const _ = require('lodash');
const config = require('getconfig');
const cpr = require('cpr');

const SRC = path.resolve(__dirname, 'src');

const isDev = config.getconfig.isDev;
const configEnv = process.env.CONFIG_ENV || 'development';
const define = _(config)
  .pick('year', 'sport', 'events', 'mock', 'ga')
  .transform((res, val, key) => {
    res[`__${key.toUpperCase()}__`] = JSON.stringify(val);
  })
  .value();

const renderHTML = (context) => html[isDev ? 'unindent' : 'minify']`
  <!DOCTYPE html>
  <html>
  <head>
    <title>Tweet Your Bracket</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="TYB">
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="icon" href="/favicon.png">
    <link rel="icon" sizes="192x192" href="/favicon-192x192.png">
    <link rel="apple-touch-icon-precomposed" href="/favicon-192x192.png">
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
  'in': `${SRC}/main.js`,
  out: 'build',
  clearBeforeBuild: true,
  output: {hash: true},
  hostname: 'localhost',
  devServer: {contentBase: 'public', noInfo: true},
  replace: {
    config: `src/config/${configEnv}.js`
  },
  html: (context) => ({
    [isDev ? 'index.html' : '200.html']: renderHTML(context)
  })
});

// Exclude style files from the src directory since only css module-ized files will be in there
webpack.module.loaders.forEach((loader) => {
  if (loader && loader.loader && loader.loader.match(/!css/)) {
    loader.exclude = [SRC];
  }
});

// Opt in to css modules with for .less files in the src dir
const cssModulesLoader = `?modules&localIdentName=${isDev ? '[path][name]___[local]___' : ''}[hash:base64:5]`;
webpack.module.loaders.push({
  test: /\.less$/,
  include: [SRC],
  loader: isDev
    ? `style-loader!css-loader${cssModulesLoader}!postcss-loader!less-loader`
    : ExtractTextPlugin.extract('style-loader', `css-loader${cssModulesLoader}!postcss-loader!less-loader`)
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

if (configEnv === 'static') {
  webpack.plugins.push(new OnBuildPlugin(_.once(() => cpr(
    path.resolve(__dirname, 'public', 'json'),
    path.resolve(__dirname, 'build', 'json'),
    {
      deleteFirst: false,
      overwrite: false
    },
    _.noop
  ))));
}

module.exports = webpack;
