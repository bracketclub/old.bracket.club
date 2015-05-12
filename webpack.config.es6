'use strict';

require('babel/register');

const webpackConfig = require('hjs-webpack');
const find = require('lodash/collection/find');
const renderHTML = require('./server/renderHTML');

const {NODE_ENV, TYB_STATIC, TYB_YEAR, TYB_SPORT} = process.env;
const isDev = NODE_ENV !== 'production';
const __YEAR__ = JSON.stringify(TYB_YEAR || '2015');
const __SPORT__ = JSON.stringify(TYB_SPORT || 'ncaa-mens-basketball');
const __STATIC__ = JSON.stringify(TYB_STATIC === 'true');

const config = webpackConfig({
    isDev,
    in: 'client/main.js',
    out: 'build',
    output: {
        hash: true
    },
    define: {__YEAR__, __SPORT__, __STATIC__},
    html: (context) => {
        return {
            'index.html': renderHTML(context)
        };
    }
});

// Mutate in place the less loader in all env to have the val-loader first
const findLessLoader = (l) => (l.loader || '').indexOf('!less') > -1;
find(config.module.loaders, findLessLoader).loader += '!val-loader';

module.exports = config;
