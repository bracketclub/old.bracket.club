/* eslint no-var:0 */

'use strict';

var path = require('path');
var LessImportInserter = require('less-import-inserter');

function buildLess () {
    var nm = path.join(__dirname, '..', 'node_modules');

    var less = new LessImportInserter({
        lessPath: nm + '/bootstrap/less/bootstrap.less',
        relativeTo: __dirname,
        after: {
            variables: [
                '../node_modules/bootswatch/united/variables',
                '_override.less'
            ]
        },
        append: [
            '../node_modules/lesshat/build/lesshat-prefixed',
            '../node_modules/bootswatch/united/bootswatch',
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
