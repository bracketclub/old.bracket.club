var templatizer = require('templatizer');
var lessitizer = require('lessitizer');
var Moonboots = require('moonboots-static');
var jade = require('jade');
var fs = require('fs');
var config = require('figs');
var year = process.env.TYB_YEAR || config.year;
var sport = process.env.TYB_SPORT || config.sport;
var liveData = require('bracket-data-live')({year: year, sport: sport});
var crypto = require('crypto');
liveData.sportYear = {
    year: year,
    sport: sport
};
var dataString = 'window.bootstrap=' + JSON.stringify(liveData) + ';';
var dataHash = crypto.createHash('sha1').update(dataString).digest('hex').slice(0, 8);
var dataFileName = 'data.' + dataHash + '.js';
var appName = require('./package').name;
var path = require('path');

var fixPath = function (pathString) {
    return path.resolve(path.normalize(pathString));
};
var quit = function(err) {
    process.exit(err ? 1 : 0);
};
var htmlSource = function (context) {
    return jade.render(fs.readFileSync(fixPath('index.jade')), {
        timestamp: require('moment')().utc().format(),
        dataPath: context.resourcePrefix + dataFileName,
        cssPath: context.resourcePrefix + context.cssFileName,
        jsPath: context.resourcePrefix + context.jsFileName
    });
};

new Moonboots({
    moonboots: {
        jsFileName: appName,
        cssFileName: appName,
        main: fixPath('clientapp/app.js'),
        developmentMode: false,
        resourcePrefix: '/assets/',
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
            templatizer(fixPath('clienttemplates'), fixPath('clientapp/templates.js'), {
                dontRemoveMixins: true
            });
        },
        beforeBuildCSS: function (cb) {
            lessitizer({
                developmentMode: false,
                files: fixPath('styles/app.less'),
                outputDir: fixPath('styles')
            }, cb);
        }
    },
    verbose: true,
    directory: fixPath('_deploy'),
    htmlSource: htmlSource,
    cb: function (err) {
        console.log(fixPath('_deploy/assets/' + dataFileName));
        fs.writeFileSync(fixPath('_deploy/assets/' + dataFileName), dataString);
        quit(err);
    }
});
