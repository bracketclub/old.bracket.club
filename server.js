var path = require('path');
var express = require('express');
var Moonboots = require('moonboots-express');
var Static = require('moonboots-static');
var templatizer = require('templatizer');
var lessitizer = require('lessitizer');
var Crawler = require('spa-crawler');
var expressApp = express();
var appName = require('./package').name;
var jade = require('jade');
var fs = require('fs');
var config = require('figs');
var mkdirp = require('mkdirp');
var sh = require('execSync');
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


// ---------------------------------------------------
// Configure our main route that will serve our moonboots app
// ---------------------------------------------------
expressApp.get('*data*.js', function (req, res) {
    res.set('Content-Type', 'text/javascript; charset=utf-8');
    res.send(dataString);
});

var moonbootsConfig = {
    jsFileName: appName,
    cssFileName: appName,
    main: fixPath('clientapp/app.js'),
    developmentMode: argv('local'),
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

if (argv('build')) {
    new Static({
        moonboots: moonbootsConfig,
        public: fixPath('public'),
        directory: fixPath('_deploy'),
        htmlSource: htmlSource,
        cb: function () {
            process.exit(0);
        }
    });
} else {
    var moonboots = new Moonboots({
        moonboots: moonbootsConfig,
        render: function () {
            htmlSource.call(this);
        },
        server: expressApp
    });
}


if (argv('pages')) {
    var crawler = new Crawler({
        rndr: {
            readyEvent: 'rendered'
        },
        app: 'http://localhost:3000/'
    });
    var pagesDir = fixPath('_pages');
    var pagesIndex = path.join(pagesDir, 'index.html');

    moonboots.on('ready', function () {
        crawler.start().crawler.on('spaurl', function (url) {
            console.log('Add', url);

            var urlFile = path.basename(url);
            var pageFile = path.join(pagesDir, urlFile) + '.html';
            var pageDir = path.dirname(url);

            mkdirp.sync(pageDir);
            sh.run(['cp', pagesIndex, pageFile].join(' '));

        }).on('complete', crawler.stop.bind(crawler, true));
    });
}


// ---------------------------------------------------
// Listen for incoming http requests on the port as specified in our config
// ---------------------------------------------------
expressApp.listen(3000);
console.log("Running at: http://localhost:" + 3000 + " Yep. That\'s pretty awesome.");
