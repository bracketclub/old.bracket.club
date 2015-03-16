var path = require('path');
var LessImportInserter = require('less-import-inserter');


module.exports = function () {
    var node_modules = path.join(__dirname, '..', 'node_modules');
    var styles = __dirname;

    return new LessImportInserter({
        lessPath: node_modules + '/bootstrap/less/bootstrap.less',
        relativeTo: '/',
        after: {
            variables: [
                styles + '/bs-united/variables.less',
                styles + '/_override.less'
            ]
        },
        append: [
            node_modules + '/lesshat/build/lesshat-prefixed',
            styles + '/bs-united/bootswatch.less',
            styles + '/app/app.less'
        ]
    }).build();
};
