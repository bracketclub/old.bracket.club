var path = require('path');
var LessImportInserter = require('less-import-inserter');

function buildLess () {
    var node_modules = path.join(__dirname, '..', 'node_modules');

    var less = new LessImportInserter({
        lessPath: node_modules + '/bootstrap/less/bootstrap.less',
        relativeTo: __dirname,
        after: {
            variables: [
                'bs-united/variables.less',
                '_override.less'
            ]
        },
        append: [
            '../node_modules/lesshat/build/lesshat-prefixed',
            'bs-united/bootswatch.less',
            'app/app.less'
        ]
    }).build();

    return less;
}

if (module.parent) {
    module.exports = buildLess;
}
else {
    process.stdout.write(buildLess());
}
