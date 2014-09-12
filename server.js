var fs = require('fs');
var path = require('path');
var express = require('express');
var Crawler = require('spa-crawler');
var lessitizer = require('lessitizer');
var Static = require('moonboots-static');
var templatizer = require('templatizer');
var Moonboots = require('moonboots-express');


var quit = function (err) { process.exit(err ? 1 : 0); };
var data = require('./build/data');
var saveIndex = require('./build/saveIndex');
var htmlFile = require('./build/html');
var fixPath = require('./build/fixpath');
var argv = require('./build/argv');


var expressApp = express();
var appName = require('./package').name;
var port = process.env.PORT || 3000;
var moonboots;
var crawler;


var options = {
    build: argv('build'),
    minify: argv('minify'),
    crawl: argv('crawl'),
    server: !argv('build') || argv('crawl'),
};


// ------------------------
// Configure Moonboots
// ------------------------
var config = {
    jsFileName: appName,
    cssFileName: appName,
    main: fixPath('clientapp/app2.js'),
    developmentMode: !options.minify,
    resourcePrefix: options.build || options.crawl ? '/assets/' : '/',
    libraries: [
        fixPath('clientapp/libraries/google-analytics.js'),
        fixPath('node_modules/jquery/dist/jquery.js'),
        fixPath('clientapp/libraries/typeahead.bundle.js'),
        // Bootstrap modules
        fixPath('clientapp/libraries/bootstrap/transition.js'),
        fixPath('clientapp/libraries/bootstrap/alert.js'),
        fixPath('clientapp/libraries/bootstrap/button.js'),
        fixPath('clientapp/libraries/bootstrap/dropdown.js'),
        fixPath('clientapp/libraries/bootstrap/collapse.js'),
        fixPath('clientapp/libraries/bootstrap/modal.js'),
        fixPath('clientapp/libraries/bootstrap/affix.js'),
        fixPath('clientapp/libraries/bootstrap/tooltip.js'),
        fixPath('clientapp/libraries/bootstrap/popover.js')
    ],
    stylesheets: [fixPath('styles/app.css')],
    beforeBuildJS: function () {
        templatizer(fixPath('clienttemplates'), fixPath('clientapp/templates.js'));
    },
    beforeBuildCSS: function (cb) {
        lessitizer({
            files: path.resolve(__dirname, 'styles/app.less'),
            outputDir: path.resolve(__dirname, 'styles')
        }, cb);
    }
};


// ------------------------
// Build static files to a dir
// ------------------------
if (options.build) {
    new Static({
        verbose: true,
        moonboots: config,
        'public': fixPath('public'),
        directory: fixPath('_deploy'),
        htmlSource: htmlFile,
        cb: function (err) {
            if (!err) {
                fs.writeFileSync(
                    fixPath('_deploy/' + config.resourcePrefix + data.filename),
                    data.string
                );
            }
            quit(err);
        }
    });
}


// ------------------------
// Start the dev server
// ------------------------
if (options.server) {
    expressApp.use(express.static(fixPath('public')));
    expressApp.get(config.resourcePrefix + data.filename, function (req, res) {
        res.set('Content-Type', 'text/javascript; charset=utf-8');
        res.send(data.string);
    });
    moonboots = new Moonboots({
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
    crawler = new Crawler({
        rndr: { readyEvent: 'renderReady' },
        app: 'http://127.0.0.1:' + port + '/',
        delayStart: 5000
    });
    moonboots.on('ready', function () {
        crawler.start().crawler
        .on('spaurl', function (url) {
            console.log(url);
            saveIndex(url);
        })
        .on('complete', quit);
        // TODO: copy the rest of the files
    });
    console.log("Crawler will crawl: http://localhost:" + port);
}
