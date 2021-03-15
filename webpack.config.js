'use strict'

const path = require('path')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const OnBuildPlugin = require('on-build-webpack')
const webpackConfig = require('hjs-webpack')
const _ = require('lodash')
const cpr = require('cpr')
const renderHTML = require('./webpack/html')
const addStyleLoaders = require('./webpack/styles')

const SRC = path.resolve(__dirname, 'src')
const nodeEnv = process.env.NODE_ENV || 'development'
const configEnv = process.env.CONFIG_ENV || 'development'
const isDev = nodeEnv === 'development'

const config = addStyleLoaders(
  webpackConfig({
    isDev,
    in: `${SRC}/main.js`,
    out: 'build',
    port: 3031,
    urlLoaderLimit: 1,
    clearBeforeBuild: true,
    output: { hash: true },
    hostname: 'localhost',
    devServer: { contentBase: 'public', noInfo: true },
    replace: {
      config: `src/config/${configEnv}.js`,
    },
    define: {
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
    },
    html: (context) => ({ 'index.html': renderHTML(context) }),
  }),
  { src: SRC, isDev }
)

// Allow for src/lib files to be required without relative paths
config.resolve.alias = {
  lib: path.resolve(__dirname, 'src', 'lib'),
}

if (process.env.WEBPACK_ANALYZE) {
  config.plugins.push(new BundleAnalyzerPlugin())
}

if (configEnv === 'static') {
  config.plugins.push(
    new OnBuildPlugin(
      _.once(() =>
        cpr(
          path.resolve(__dirname, '..', 'api', '.export'),
          path.resolve(__dirname, 'build', 'json'),
          {
            deleteFirst: false,
            overwrite: false,
          },
          _.noop
        )
      )
    )
  )
}

module.exports = config
