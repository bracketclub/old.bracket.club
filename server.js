var path = require('path');
var express = require('express');
var Moonboots = require('moonboots');
var config = require('getconfig');
var app = express();
var build = require('./build');
var appName = require('./package').name;


// a little helper for fixing paths for various enviroments
var fixPath = function (pathString) {
    return path.resolve(path.normalize(pathString));
};


// -----------------
// Configure express
// -----------------
app.use(express.compress());
app.use(express.static(fixPath('public')));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.set('view engine', 'jade');


// ---------------------------------------------------
// Configure Moonboots to serve our client application
// ---------------------------------------------------
var clientApp = new Moonboots({
    jsFileName: appName,
    cssFileName: appName,
    main: fixPath('clientapp/app.js'),
    developmentMode: config.isDev,
    libraries: [
        fixPath('clientapp/libraries/goinstant.min.js'),
        fixPath('node_modules/jquery/dist/jquery.js'),
        // Bootstrap modules
        fixPath('clientapp/libraries/bootstrap/transition.js'),
        fixPath('clientapp/libraries/bootstrap/alert.js'),
        fixPath('clientapp/libraries/bootstrap/button.js'),
        fixPath('clientapp/libraries/bootstrap/collapse.js'),
        fixPath('clientapp/libraries/bootstrap/dropdown.js'),
        fixPath('clientapp/libraries/bootstrap/modal.js'),
        fixPath('clientapp/libraries/bootstrap/tooltip.js'),
        fixPath('clientapp/libraries/bootstrap/affix.js')
    ],
    stylesheets: [
        fixPath('styles/app.css')
    ],
    server: app,
    beforeBuildJS: build.js,
    beforeBuildCSS: build.css
});


// Build to deploy dir
if (process.argv.join(' ').indexOf(' --build') > -1) {
    build.static(clientApp, appName);
    return;
}

// use a cookie to send config items to client
var clientSettingsMiddleware = function (req, res, next) {
    res.cookie('config', JSON.stringify(config.client));
    next();
};

// configure our main route that will serve our moonboots app
app.get('*', clientSettingsMiddleware, clientApp.html());

// listen for incoming http requests on the port as specified in our config
app.listen(config.http.port);
console.log("Running at: http://localhost:" + config.http.port + " Yep. That\'s pretty awesome.");
