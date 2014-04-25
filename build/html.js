var fs = require('fs');
var timestamp = require('moment')().utc().format();
var _ = require('underscore');
var jade = require('jade');
var data = require('./data');
var fixPath = require('fixpath');

module.exports = function (context) {
    return jade.render(fs.readFileSync(fixPath('views/index.jade')), _.extend(context, {
        timestamp: timestamp,
        dataFileName: data.fileName
    }));
};