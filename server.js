var path = require('path');
var express = require('express');
var Moonboots = require('moonboots');
var expressApp = express();
var build = require('./build');
var appName = require('./package').name;
var jade = require('jade');
var fs = require('fs');
var year = '2014';
var sport = 'ncaa-mens-basketball';
var data = require('bracket-data-live')({year: year, sport: sport});
// a little helper for fixing paths for various enviroments
var fixPath = function (pathString) {
    return path.resolve(path.normalize(pathString));
};


// -----------------
// Configure express
// -----------------
expressApp.use(express.static(fixPath('public')));


// -----------------
// Override Moonboots template file
// -----------------
Moonboots.prototype.getTemplate = function () {
    var templateData = data;
    templateData.sportYear = {
        year: year,
        sport: sport
    };
    return jade.render(fs.readFileSync(fixPath('index.jade')), {
        bootstrapData: JSON.stringify(templateData),
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
    developmentMode: true,
    libraries: [
        fixPath('clientapp/libraries/google-analytics.js'),
        fixPath('node_modules/jquery/dist/jquery.js'),
        // Bootstrap modules
        fixPath('clientapp/libraries/bootstrap/transition.js'),
        fixPath('clientapp/libraries/bootstrap/alert.js'),
        fixPath('clientapp/libraries/bootstrap/button.js'),
        fixPath('clientapp/libraries/bootstrap/dropdown.js'),
        fixPath('clientapp/libraries/bootstrap/collapse.js'),
        fixPath('clientapp/libraries/bootstrap/modal.js'),
        fixPath('clientapp/libraries/bootstrap/affix.js')
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


// ---------------------------------------------------
// Build to deploy directory if CLI flag is set
// ---------------------------------------------------
if (process.argv.join(' ').indexOf(' --build') > -1) {
    console.log('Starting build');
    return build.static(clientApp, appName);
}


// ---------------------------------------------------
// Configure our main route that will serve our moonboots app
// ---------------------------------------------------
expressApp.get('*', clientApp.html());


// ---------------------------------------------------
// Listen for incoming http requests on the port as specified in our config
// ---------------------------------------------------
expressApp.listen(3000);
console.log("Running at: http://localhost:" + 3000 + " Yep. That\'s pretty awesome.");
