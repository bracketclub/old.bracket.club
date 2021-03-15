'use strict'

const html = require('html-tagged-literals')

module.exports = (context, isDev) => html[isDev ? 'unindent' : 'minify']`
  <!DOCTYPE html>
  <html>
  <head>
    <title>Bracket Club</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="Brackt Club">
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
`
