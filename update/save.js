var saveEntry = require('../build').saveEntry;
var saveMaster = require('../build').saveMaster;
var path = require('path');
var exec = require('child_process').exec;
var async = require('async');
var rootPath = path.resolve(__dirname, '..');
var runCommandFn = function (cmd) {
    return function (cb) {
        console.log(cmd);
        exec(cmd, {
            cwd: rootPath
        }, cb);
    };
};

module.exports.entry = function (year, entry) {
    async.series([
        runCommandFn('git co production'),
        runCommandFn('git pull origin production'),
        function (cb) {
            saveEntry(year, entry, cb);
        },
        runCommandFn('git add data/*'),
        runCommandFn('git commit -m "Updating entry data"'),
        runCommandFn('git push origin production')
    ], function (err) {
        console.log(err || 'No error');
    });
};

module.exports.master = function (year, master) {
    async.series([
        runCommandFn('git co production'),
        runCommandFn('git pull origin production'),
        function (cb) {
            saveMaster(year, master, cb);
        },
        runCommandFn('git add data/*'),
        runCommandFn('git commit -m "Updating master data"'),
        runCommandFn('git push origin production')
    ], function (err) {
        console.log(err || 'No error');
    });
};
