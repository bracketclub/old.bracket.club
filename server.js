var path = require('path');
var express = require('express');
var Moonboots = require('moonboots-express');
var expressApp = express();
var build = require('./build');
var appName = require('./package').name;
var jade = require('jade');
var fs = require('fs');
var config = require('figs');
var year = process.env.TYB_YEAR || config.year;
var sport = process.env.TYB_SPORT || config.sport;
var liveData = require('bracket-data-live')({year: year, sport: sport});
var argv = function (flag) {
    return process.argv.join(' ').indexOf('--' + flag) > -1;
};
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
var htmlSource = function (cb) {
    cb(null, jade.render(fs.readFileSync(fixPath('index.jade')), {
        timestamp: require('moment')().utc().format(),
        dataPath: this.config.resourcePrefix + dataFileName,
        cssPath: this.config.resourcePrefix + this.cssFileName(),
        jsPath: this.config.resourcePrefix + this.jsFileName()
    }));
};

// -----------------
// Moonboots variable options
// -----------------
var buildDirectory = null;
var resourcePrefix = '/';

if (argv('build')) {
    buildDirectory = fixPath('_deploy');
    resourcePrefix = '/assets/';
} else if (argv('pages')) {
    buildDirectory = fixPath('_pages');
    resourcePrefix = '/assets/';
}

// ---------------------------------------------------
// Configure our main route that will serve our moonboots app
// ---------------------------------------------------
expressApp.get(resourcePrefix + 'data*.js', function (req, res) {
    res.set('Content-Type', 'text/javascript; charset=utf-8');
    res.send(dataString);
});


// ---------------------------------------------------
// Configure Moonboots to serve our client application
// ---------------------------------------------------
var clientApp = new Moonboots({
    moonboots: {
        jsFileName: appName,
        cssFileName: appName,
        main: fixPath('clientapp/app.js'),
        developmentMode: argv('local'),
        buildDirectory: buildDirectory,
        resourcePrefix: argv('build') || argv('pages') ? '/assets/' : '/',
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
        beforeBuildJS: build.js,
        beforeBuildCSS: build.css
    },
    handlers: {
        html: function (cb) {
            htmlSource.call(this, cb);
        }
    },
    server: expressApp
});

clientApp.dataFileName = dataFileName;
clientApp.dataString = dataString;


// ---------------------------------------------------
// Build to deploy directory if CLI flag is set
// ---------------------------------------------------
if (argv('build')) {
    console.log('Starting build');
    return build.static(clientApp, appName, '_deploy', function () {
        process.exit(0);
    });
}


// ---------------------------------------------------
// Build to pages directory if CLI flag is set
// ---------------------------------------------------
if (argv('pages')) {
    build.pages(clientApp, appName, '_pages', function () {
        process.exit(0);
    });
}


// ---------------------------------------------------
// Listen for incoming http requests on the port as specified in our config
// ---------------------------------------------------
expressApp.listen(3000);
console.log("Running at: http://localhost:" + 3000 + " Yep. That\'s pretty awesome.");
