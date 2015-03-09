var express = require('express');
var Moonboots = require('moonboots-express');
var Static = require('moonboots-static');
var jade = require('jade');
var extend = require('lodash/object/extend');
var fs = require('fs');

var fixPath = require('./lib/fixpath');
var options = require('./lib/options');
var config = require('./lib/config');

var port = process.env.PORT || 3000;
var sport = 'ncaa-mens-basketball';
var year = '2015';

var htmlFile = function (context) {
    return jade.render(fs.readFileSync(fixPath('views/index.jade')), extend(context, {
        sport: sport,
        year: year
    }));
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
        cb: function (err) { process.exit(err ? 1 : 0); }
    });
}

// ------------------------
// Start the dev server
// ------------------------
else {
    var expressApp = express();
    expressApp.use(express.static(fixPath('public')));
    new Moonboots({
        moonboots: config,
        render: function (req, res) {
            res.send(htmlFile(res.locals));
        },
        server: expressApp
    });
    expressApp.listen(port);
    console.log("Running at: http://localhost:" + port);
}
