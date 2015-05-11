'use strict';

var webpackConfig = require('hjs-webpack');
var webpack = require('webpack');

var _process$env = process.env;
var NODE_ENV = _process$env.NODE_ENV;
var TYB_STATIC = _process$env.TYB_STATIC;
var TYB_YEAR = _process$env.TYB_YEAR;
var TYB_SPORT = _process$env.TYB_SPORT;

var isDev = NODE_ENV !== 'production';
var __YEAR__ = JSON.stringify(TYB_YEAR || '2015');
var __SPORT__ = JSON.stringify(TYB_SPORT || 'ncaa-mens-basketball');
var __STATIC__ = JSON.stringify(TYB_STATIC === 'true');

module.exports = webpackConfig({
    isDev: isDev,
    'in': './client/main.jsx',
    out: 'build',
    output: {
        filename: 'bundle',
        cssFilename: 'bundle',
        hash: true
    },
    plugins: [new webpack.DefinePlugin({ __SPORT__: __SPORT__, __YEAR__: __YEAR__, __STATIC__: __STATIC__ })],
    html: function html(context) {
        return '\n            <!DOCTYPE html>\n            <html>\n            <head>\n                <title>Tweet Your Bracket</title>\n                <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0">\n                <meta name="apple-mobile-web-app-capable" content="yes">\n                <link rel="stylesheet" href="' + context.css + '">\n            </head>\n            <body>\n                <script>(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;e=o.createElement(i);r=o.getElementsByTagName(i)[0];e.src=\'https://www.google-analytics.com/analytics.js\';r.parentNode.insertBefore(e,r)}(window,document,\'script\',\'ga\'));ga(\'create\',\'UA-8402584-9\',\'auto\');window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,"script","twitter-wjs"));</script>\n                <script src="' + context.main + '"></script>\n            </body>\n            </html>\n        ';
    }
});
