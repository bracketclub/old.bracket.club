var path = require('path');
var mkdirp = require('mkdirp');
var sh = require('execSync');
var fixPath = require('./fixpath');
var pagesDir = fixPath('_pages');
var pagesIndex = path.join(pagesDir, 'index.html');


module.exports = function (url) {
    console.log(url);
    var urlFile = path.basename(url);
    var pageFile = path.join(pagesDir, urlFile) + '.html';
    var pageDir = path.dirname(url);

    mkdirp.sync(pageDir);
    sh.run(['cp', pagesIndex, pageFile].join(' '));
};
