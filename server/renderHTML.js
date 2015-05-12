'use strict';

const {renderToString, createElement} = require('react');

// TODO: make this method run the full react router handler
const render = (page, data = {}) => renderToString(createElement(page, data));

const renderHTML = (context, page, data) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Tweet Your Bracket</title>
            <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <link rel="stylesheet" href="${context.css}">
        </head>
        <body>
            ${page ? render(page, data) : ''}
            <script>(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;e=o.createElement(i);r=o.getElementsByTagName(i)[0];e.src='https://www.google-analytics.com/analytics.js';r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));ga('create','UA-8402584-9','auto');window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,"script","twitter-wjs"));</script>
            <script src="${context.main}"></script>
        </body>
        </html>
    `.replace(/\n\s*/g, '');
};

module.exports = renderHTML;
