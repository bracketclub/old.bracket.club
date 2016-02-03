/* eslint-env node */

'use strict';

const path = require('path');
const webpackConfig = require('hjs-webpack');
const _ = require('lodash');

const env = process.env;
const isDev = env.NODE_ENV !== 'production';

const SPORT = 'ncaam';
const YEAR = '2016';
const EVENTS = [
  'ncaam-2016',
  'ncaaw-2016',
  'ncaam-2015',
  'ncaam-2014',
  'ncaam-2013',
  'ncaam-2012'
];

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
      <script>(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;e=o.createElement(i);r=o.getElementsByTagName(i)[0];e.src='https://www.google-analytics.com/analytics.js';r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));ga('create','UA-8402584-9','auto');window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,"script","twitter-wjs"));</script>
      <script src="/${context.main}"></script>
  </body>
  </html>`.replace(/\n\s*/g, '');

const config = webpackConfig({
  isDev,
  'in': 'src/main.js',
  out: 'build',
  clearBeforeBuild: true,
  replace: {
    config: `src/config/${isDev ? 'development' : 'production'}.js`
  },
  output: {hash: true},
  define: _.transform({YEAR, SPORT, EVENTS}, (res, val, key) => {
    res[`__${key}__`] = JSON.stringify(val);
  }),
  hostname: 'lukekarrys.local',
  devServer: {
    contentBase: 'public'
  },
  html: (context) => ({
    [isDev ? 'index.html' : '200.html']: renderHTML(context)
  })
});

// Allow for src/lib files to be required without relative paths
config.resolve.alias = {
  lib: path.resolve(__dirname, 'src', 'lib')
};

// Mutate in place the less loader in all env to have the val-loader first
const findLessLoader = (l) => (l.loader || '').indexOf('!less') > -1;
config.module.loaders.find(findLessLoader).loader += '!val-loader';

module.exports = config;
