var path = require('path');
var express = require('express');
var Moonboots = require('moonboots');
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
    developmentMode: process.argv.join(' ').indexOf(' --minify'),
    libraries: [
        fixPath('clientapp/libraries/goinstant.min.js'),
        fixPath('node_modules/jquery/dist/jquery.js'),
        // Bootstrap modules
        fixPath('clientapp/libraries/bootstrap/transition.js'),
        fixPath('clientapp/libraries/bootstrap/alert.js'),
        fixPath('clientapp/libraries/bootstrap/button.js'),
        fixPath('clientapp/libraries/bootstrap/dropdown.js'),
        fixPath('clientapp/libraries/bootstrap/modal.js'),
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
    return build.static(clientApp, appName);
}

// configure our main route that will serve our moonboots app
app.get('*', clientApp.html());

// listen for incoming http requests on the port as specified in our config
app.listen(3000);
console.log("Running at: http://localhost:" + 3000 + " Yep. That\'s pretty awesome.");
