var path = require('path');


module.exports = function (pathString) {
    return path.resolve(path.normalize(pathString));
};