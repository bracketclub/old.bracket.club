var path = require('path');
var express = require('express');
var Moonboots = require('moonboots');
var expressApp = express();
var build = require('./build');
var appName = require('./package').name;
var jade = require('jade');
var fs = require('fs');
var config = require('figs');
var year = process.env.TYB_YEAR || config.year;
var sport = process.env.TYB_SPORT || config.sport;
var liveData = require('bracket-data-live')({year: year, sport: sport});
var isLocal = process.argv.join(' ').indexOf('--local') > -1;
// a little helper for fixing paths for various enviroments
var fixPath = function (pathString) {
    return path.resolve(path.normalize(pathString));
};

var crypto = require('crypto');
liveData.sportYear = {
    year: year,
    sport: sport
};
var dataString = 'window.bootstrap=' + JSON.stringify(liveData) + ';';
var dataHash = crypto.createHash('sha1').update(dataString).digest('hex').slice(0, 8);
var dataFileName = 'data.' + dataHash + '.js';

// -----------------
// Configure express
// -----------------
expressApp.use(express.static(fixPath('public')));


// -----------------
// Override Moonboots template file
// -----------------
Moonboots.prototype.getTemplate = function () {
    return jade.render(fs.readFileSync(fixPath('index.jade')), {
        timestamp: require('moment')().utc().format(),
        dataPath: this.config.resourcePrefix + dataFileName,
        cssPath: this.config.resourcePrefix + this.cssFileName(),
        jsPath: this.config.resourcePrefix + this.jsFileName()
    });
};


// ---------------------------------------------------
// Configure Moonboots to serve our client application
// ---------------------------------------------------
var clientApp = new Moonboots({
    jsFileName: appName,
    cssFileName: appName,
    main: fixPath('clientapp/app.js'),
    developmentMode: isLocal,
    libraries: [
        fixPath('clientapp/libraries/google-analytics.js'),
        fixPath('clientapp/libraries/raf.js'),
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
    stylesheets: [
        fixPath('styles/app.css')
    ],
    browserify: {
        debug: false
    },
    server: expressApp,
    beforeBuildJS: build.js,
    beforeBuildCSS: build.css
});

clientApp.dataFileName = dataFileName;
clientApp.dataString = dataString;


// ---------------------------------------------------
// Build to deploy directory if CLI flag is set
// ---------------------------------------------------
if (process.argv.join(' ').indexOf(' --build') > -1) {
    console.log('Starting build');
    return build.static(clientApp, appName, '_deploy', function () {
        process.exit(0);
    });
}


// ---------------------------------------------------
// Configure our main route that will serve our moonboots app
// ---------------------------------------------------
expressApp.get('/data*.js', function (req, res) {
    res.set('Content-Type', 'text/javascript; charset=utf-8');
    res.send(dataString);
});

expressApp.get('*', clientApp.html());


// ---------------------------------------------------
// Build to pages directory if CLI flag is set
// ---------------------------------------------------
if (process.argv.join(' ').indexOf(' --pages') > -1) {
    var pages = function () {
        build.pages(clientApp, appName, '_pages', function () {
            process.exit(0);
        });
    };
    if (clientApp.ready) {
        pages();
    } else {
        clientApp.on('ready', pages);
    }
}


// ---------------------------------------------------
// Listen for incoming http requests on the port as specified in our config
// ---------------------------------------------------
expressApp.listen(3000);
console.log("Running at: http://localhost:" + 3000 + " Yep. That\'s pretty awesome.");
