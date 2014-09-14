var fs = require('fs');
var Static = require('moonboots-static');
var fixPath = require('./fixpath');
var config = require('./config');
var htmlFile = require('./html');
var data = require('./data');


module.exports = function (path, cb) {
    new Static({
        verbose: true,
        moonboots: config,
        'public': fixPath('public'),
        directory: fixPath(path),
        htmlSource: htmlFile,
        cb: function (err) {
            if (!err) {
                fs.writeFileSync(
                    fixPath(path + '/' + config.resourcePrefix + data.filename),
                    data.string
                );
            }
            cb(err);
        }
    });
};
