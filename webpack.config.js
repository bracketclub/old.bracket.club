'use strict';

const webpackConfig = require('hjs-webpack');
const find = require('lodash/collection/find');

const {NODE_ENV, TYB_STATIC, TYB_YEAR, TYB_SPORT} = process.env;
const isDev = NODE_ENV !== 'production';
const __YEAR__ = JSON.stringify(TYB_YEAR || '2015');
const __SPORT__ = JSON.stringify(TYB_SPORT || 'ncaa-mens-basketball');
const __STATIC__ = JSON.stringify(TYB_STATIC === 'true');

const renderHTML = (context) =>
  `<!DOCTYPE html>
  <html>
  <head>
      <title>Tweet Your Bracket</title>
      <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0">
      <meta name="apple-mobile-web-app-capable" content="yes">
      <link rel="stylesheet" href="${context.css}">
  </head>
  <body>
      <script>(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;e=o.createElement(i);r=o.getElementsByTagName(i)[0];e.src='https://www.google-analytics.com/analytics.js';r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));ga('create','UA-8402584-9','auto');window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,"script","twitter-wjs"));</script>
      <script src="${context.main}"></script>
  </body>
  </html>`.replace(/\n\s*/g, '');

const config = webpackConfig({
  isDev,
  'in': 'client/main.js',
  out: 'build',
  output: {
    hash: true
  },
  define: {__YEAR__, __SPORT__, __STATIC__},
  html: (context) => ({
    'index.html': renderHTML(context)
  })
});

// Mutate in place the less loader in all env to have the val-loader first
const findLessLoader = (l) => (l.loader || '').indexOf('!less') > -1;
find(config.module.loaders, findLessLoader).loader += '!val-loader';

module.exports = config;
