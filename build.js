var fs = require('fs');
var path = require('path');
var templatizer = require('templatizer');
var less = require('less');
var rmrf = require('rmrf');
var mkdirp = require('mkdirp');
var sh = require('execSync');
var async = require('async');
var Crawler = require('simplecrawler');
var url = require('url');
var path = require('path');
var fixPath = function (pathString) {
    return path.resolve(path.normalize(pathString));
};

var proxyToPort = '3000';
var proxyPort = '8001';
var proxyHost = 'localhost';
var proxyKey = 'href';
Crawler.prototype.queueLinkedItems = function (resourceData, queueItem) {
    var crawler = this,
        resources = [];

    resources = crawler.discoverResources(resourceData, queueItem).map(function (r) {
        var parsed = url.parse(r, true);
        var ext = path.extname(parsed.pathname);
        var parsedQueryKey;

        if (parsed.query[proxyKey]) {
            parsedQueryKey = url.parse(parsed.query[proxyKey]);

            if (
                parsedQueryKey.hostname === proxyHost && parsedQueryKey.port === proxyToPort &&
                parsed.hostname === proxyHost && parsed.port === proxyPort
            ) {
                if (ext === '.html' || ext === '') {
                    delete parsed.search;
                    parsed.query[proxyKey] = url.format({
                        protocol: parsed.protocol,
                        key: proxyKey,
                        hostname: parsed.hostname,
                        port: proxyToPort,
                        pathname: parsed.pathname
                    });
                    parsed.pathname = '/';
                } else {
                    return '';
                }
            }
        }

        return url.format(parsed);
    });

    resources.forEach(function (_url) { crawler.queueURL(_url, queueItem); });

    return crawler;
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

module.exports.static = function (clientApp, appName, dir, cb) {
    var deployDir = fixPath(dir || '_deploy');
    var assetsDir = fixPath(deployDir + '/assets');
    console.log('Removing old deploy dir');
    rmrf(deployDir);
    console.log('Making deploy and assets dirs');
    mkdirp.sync(deployDir);
    mkdirp.sync(assetsDir);
    clientApp.config.developmentMode = false;
    clientApp.config.resourcePrefix = '/assets/';
    console.log('Building app data file');
    fs.writeFileSync(fixPath(assetsDir + '/' + clientApp.dataFileName), clientApp.dataString);
    console.log('Building app');
    clientApp.build(deployDir, function () {
        console.log('Copying app to deploy dir');
        sh.run('cp -r public/* ' + deployDir);
        sh.run('mv ' + deployDir + '/' + appName + '.* ' + assetsDir);
        cb();
    });
};

module.exports.pages = function (clientApp, appName, dir, cb) {
    this.static(clientApp, appName, dir, function () {
        var initialPath = '/?' + proxyKey + '=' + encodeURIComponent(url.format({
            protocol: 'http:',
            key: proxyKey,
            hostname: proxyHost,
            port: proxyToPort,
            pathname: '/'
        }));
        var myCrawler = new Crawler(proxyHost, initialPath, proxyPort);
        var idle;
        myCrawler.maxConcurrency = 4;

        var pagesDir = fixPath(dir);
        var pagesIndex = path.join(pagesDir, 'index.html');

        myCrawler.on('queueadd', function (queueItem) {
            var urlPath = url.parse(url.parse(queueItem.url, true).query.href).pathname.slice(1);
            console.log('Add', urlPath);

            var pageFile = path.join(pagesDir, urlPath) + '.html';
            var pageDir = path.dirname(pageFile);

            mkdirp.sync(pageDir);
            sh.run(['cp', pagesIndex, pageFile].join(' '));

            idle && clearTimeout(idle);
            idle = setTimeout(function () {
                myCrawler.stop();
                cb();
            }, 5000);
        });

        myCrawler.start();
    });
};
