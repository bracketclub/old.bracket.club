var path = require('path');
var fs = require('fs');


function toImports (arr) {
    if (!Array.isArray(arr)) {
        arr = [arr];
    }
    return '\n' + arr.map(function (line) {
        return '@import "' + line + '";';
    }).join('\n');
}

function Bootstrap(options) {
    options || (options = {});
    this.override = toImports(options.override);
    this.append = toImports(options.append);

    return this.build();
}

Bootstrap.prototype.build = function () {
    var res = fs.readFileSync(path.resolve(this.pathToBootstrap()), 'utf8');
    res = res.replace(/^(@import ")(.*?)(";)$/gm, '$1' + path.dirname(this.pathToBootstrap()) + '/$2$3');
    res = res.split('\n');
    res = res.map(function (line) {
        if (line.indexOf('variables.less') > -1) {
            line += this.override;
        }
        return line;
    }, this).join('\n');
    res += this.append;
    return res;
};

Bootstrap.prototype.pathToBootstrap = function () {
    return 'node_modules/bootstrap/less/bootstrap.less';
};

module.exports = Bootstrap;