var lessitizer = require('lessitizer');
var fixPath = require('./fixpath');
var LessImportInserter = require('less-import-inserter');


module.exports = function (options, cb) {
    lessitizer({
        developmentMode: !options.minify,
        files: {
            less: new LessImportInserter({
                lessPath: fixPath('node_modules/bootstrap/less/bootstrap.less'),
                relativeTo: fixPath('styles'),
                after: {
                    variables: [
                        'bs-united/variables.less',
                        '_override.less'
                    ]
                },
                append: [
                    'bs-united/bootswatch.less',
                    'app/app.less'
                ]
            }).build(),
            filename: 'app'
        },
        outputDir: fixPath('styles')
    }, cb);
};