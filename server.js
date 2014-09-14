var express = require('express');
var Crawler = require('spa-crawler');
var Moonboots = require('moonboots-express');


var quit = function (err) { process.exit(err ? 1 : 0); };
var build = require('./build/build');
var data = require('./build/data');
var saveIndex = require('./build/saveIndex');
var htmlFile = require('./build/html');
var fixPath = require('./build/fixpath');
var options = require('./build/options');
var config = require('./build/config');
var port = process.env.PORT || 3000;



// ------------------------
// Build static files to a dir
// ------------------------
if (options.build) {
    build('_deploy', function (err) {
        quit(err);
    });
}



// ------------------------
// Start the dev server
// ------------------------
if (options.server) {
    var expressApp = express();
    expressApp.use(express.static(fixPath('public')));
    expressApp.get(config.resourcePrefix + data.filename, function (req, res) {
        res.set('Content-Type', 'text/javascript; charset=utf-8');
        res.send(data.string);
    });
    var moonboots = new Moonboots({
        moonboots: config,
        render: function (req, res) {
            res.send(htmlFile(res.locals));
        },
        server: expressApp
    });
    expressApp.listen(port);
    console.log("Running at: http://localhost:" + port);
}



// ------------------------
// Crawl the dev server
// ------------------------
if (options.crawl) {
    build('_crawl', function () {
        var crawler = new Crawler({
            rndr: { readyEvent: 'renderReady' },
            app: 'http://127.0.0.1:' + port + '/',
            delayStart: 5000
        });
        var startCrawler = function () {
            crawler.start().crawler
            .on('spaurl', saveIndex)
            .on('complete', quit);
        };
        if (moonboots.ready) {
            startCrawler();
        } else {
            moonboots.on('ready', startCrawler);
        }
        console.log("Crawler will crawl: http://localhost:" + port);
    });
}
