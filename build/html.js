var fs = require('fs');
var timestamp = require('moment')().utc().format();
var extend = require('underscore').extend;
var jade = require('jade');
var data = require('./data');
var fixPath = require('./fixpath');
var index = fs.readFileSync(fixPath('views/index.jade'));


module.exports = function (context) {
    return jade.render(index, extend(context, {
        timestamp: timestamp,
        dataFileName: data.filename
    }));
};
