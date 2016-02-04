/* eslint-env node */

'use strict';

const path = require('path');
const webpackConfig = require('hjs-webpack');
const _ = require('lodash');
const config = require('getconfig');

const isDev = config.getconfig.isDev;
const define = _(config)
  .pick('year', 'sport', 'events', 'mock', 'ga')
  .transform((res, val, key) => res[`__${key.toUpperCase()}__`] = JSON.stringify(val))
  .value();

const renderHTML = (context) =>
  `<!DOCTYPE html>
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
  </html>`.replace(/\n\s*/g, '');

const webpack = webpackConfig({
  isDev,
  define,
  'in': 'src/main.js',
  out: 'build',
  clearBeforeBuild: true,
  output: {hash: true},
  hostname: 'lukekarrys.local',
  devServer: {contentBase: 'public'},
  replace: {
    config: `src/config/${isDev ? 'development' : 'production'}.js`
  },
  html: (context) => ({
    [isDev ? 'index.html' : '200.html']: renderHTML(context)
  })
});

// Allow for src/lib files to be required without relative paths
webpack.resolve.alias = {
  lib: path.resolve(__dirname, 'src', 'lib')
};

// Mutate in place the less loader in all env to have the val-loader first
const findLessLoader = (l) => (l.loader || '').indexOf('!less') > -1;
webpack.module.loaders.find(findLessLoader).loader += '!val-loader';

module.exports = webpack;
