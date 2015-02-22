var fs = require('fs');
var path = require('path');
var fixPath = require('./fixpath');
var filename = function (file) {
    return path.basename(file, path.extname(file));
};


module.exports = function exportDirectory (dir) {
    var dirPath = fixPath(dir);

    var contents = fs.readdirSync(dirPath).filter(function (file) {
        return filename(file) !== 'index' && fs.statSync(path.join(dirPath, file)).isFile();
    });

    var exportString = 'module.exports = {';
    contents.forEach(function (file) {
        exportString += filename(file) + ':require(\'./' + file + '\'),';
    });
    exportString = exportString.substring(0, exportString.length - 1);
    exportString += '};';

    fs.writeFileSync(path.join(dirPath, 'index.js'), exportString);
};