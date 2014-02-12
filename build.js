var fs = require('fs');
var path = require('path');
var templatizer = require('templatizer');
var less = require('less');
var rmrf = require('rmrf');
var mkdirp = require('mkdirp');
var sh = require('execSync');
var async = require('async');
var fixPath = function (pathString) {
    return path.resolve(path.normalize(pathString));
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
    rmrf(deployDir);
    mkdirp(deployDir);
    mkdirp(assetsDir);
    clientApp.config.developmentMode = false;
    clientApp.config.resourcePrefix = '/assets/';
    clientApp.build(deployDir, function () {
        sh.run('cp -r public/* ' + deployDir);
        sh.run('mv ' + deployDir + '/' + appName + '.* ' + assetsDir);
        process.exit(0);
    });
};