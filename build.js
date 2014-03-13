var fs = require('fs');
var path = require('path');
var templatizer = require('templatizer');
var less = require('less');
var rmrf = require('rmrf');
var mkdirp = require('mkdirp');
var sh = require('execSync');
var async = require('async');
var jsonUpdate = require('json-update');
var _ = require('underscore');
var fixPath = function (pathString) {
    return path.resolve(path.normalize(pathString));
};
var loadJson = function (year, cb) {
    var jsonPath = path.resolve(__dirname, 'data', year + '.json');
    jsonUpdate.load(jsonPath, function (err, obj) {
        if (err || !obj) obj = {};
        cb(jsonPath, obj);
    });
};


module.exports.js = function () {
    templatizer(fixPath('clienttemplates'), fixPath('clientapp/templates.js'));
};

module.exports.css = function (cb) {
    var lessDir = path.resolve(__dirname, 'styles'),
        cssOutputDir = lessDir,
        lessFiles = ['app'];

    async.each(lessFiles, function (filename, _cb) {
        var lessPath = path.resolve(lessDir, filename + '.less');
        var cssPath = path.resolve(cssOutputDir, filename + '.css');
        var lessString = fs.readFileSync(lessPath, 'utf8');

        var parser = new less.Parser({
            relativeUrls: true,
            paths: [lessDir],
            outputDir: cssOutputDir,
            optimization: 1,
            filename: filename + '.less'
        });

        parser.parse(lessString, function (err, cssTree) {
            if (err) return _cb(less.formatError(err));
            fs.writeFileSync(cssPath, cssTree.toCSS(), 'utf8');
            _cb();
        });
    }, cb);
};

module.exports.static = function (clientApp, appName) {
    var deployDir = fixPath('_deploy');
    var assetsDir = fixPath(deployDir + '/assets');
    console.log('Removing old deploy dir');
    rmrf(deployDir);
    console.log('Making deploy and assets dirs');
    mkdirp(deployDir);
    mkdirp(assetsDir);
    clientApp.config.developmentMode = false;
    clientApp.config.resourcePrefix = '/assets/';
    console.log('Building app');
    clientApp.build(deployDir, function () {
        console.log('Copying app to deploy dir');
        sh.run('cp -r public/* ' + deployDir);
        sh.run('mv ' + deployDir + '/' + appName + '.* ' + assetsDir);
        process.exit(0);
    });
};

module.exports.saveEntry = function (year, entry, cb) {
    loadJson(year, function (jsonPath, obj) {
        if (!obj.entries) obj.entries = [];
        var existing = false;
        _.each(obj.entries, function (e, index, list) {
            if (e.user_id === entry.user_id) {
                list[index] = entry;
                existing = true;
            }
        });
        if (!existing) obj.entries.push(entry);
        jsonUpdate.update(jsonPath, obj, cb);
    });
};

module.exports.saveMaster = function (year, master, cb) {
    loadJson(year, function (jsonPath, obj) {
        if (!obj.masters) obj.masters = [];
        var latest = _.last(obj.masters);
        if (latest !== master) obj.masters.push(master);
        jsonUpdate.update(jsonPath, obj, cb);
    });
};