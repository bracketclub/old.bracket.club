var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var urlParse = require('url').parse;
var fixPath = require('./fixpath');
var crawlDir = fixPath('_crawl');


module.exports = function (url) {
    var index = fs.readFileSync(fixPath('_deploy/index.html'), 'utf8');
    var pathname = urlParse(url).pathname;
    var pageFile = path.join(crawlDir, pathname === '/' ? 'index' : pathname) + '.html';
    var pageDir = path.dirname(pageFile);

    console.log('Copying...');
    console.log(pageFile);

    mkdirp.sync(pageDir);
    fs.writeFileSync(pageFile, index);
};
