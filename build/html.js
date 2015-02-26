var fs = require('fs');
var timestamp = new Date().toJSON();
var extend = require('lodash/object/extend');
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
