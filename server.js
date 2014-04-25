var path = require('path');
var express = require('express');
var Moonboots = require('moonboots-express');
var Static = require('moonboots-static');
var templatizer = require('templatizer');
var lessitizer = require('lessitizer');
var Crawler = require('spa-crawler');
var expressApp = express();
var appName = require('./package').name;
var saveIndex = require('./build/saveIndex');
var htmlFile = require('./build/html');
var fixPath = require('./build/fixpath');
var port = process.env.PORT || 3000;
var argv = function (flag) {
    return process.argv.join(' ').indexOf('--' + flag) > -1;
};


// -----------------
// Configure express
// -----------------
expressApp.use(express.static(fixPath('public')));


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
        htmlSource: function (context) {
            return htmlFile(context);
        },
        cb: function () {
            process.exit(0);
        }
    });
} else {
    var moonboots = new Moonboots({
        moonboots: moonbootsConfig,
        render: function (req, res) {
            res.send(htmlFile(res.locals));
        },
        server: expressApp
    });

    if (argv('pages')) {
        var crawler = new Crawler({
            rndr: {
                readyEvent: 'rendered'
            },
            app: 'http://localhost:' + port + '/'
        });
        moonboots.on('ready', function () {
            crawler.start()
            .crawler.on('spaurl', saveIndex)
            .on('complete', crawler.stop.bind(crawler, true));
        });
    }

    expressApp.listen(port);
    console.log("Running at: http://localhost:" + port + " Yep. That\'s pretty awesome.");
}






