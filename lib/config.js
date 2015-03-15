var lessitizer = require('lessitizer');
var fixPath = require('./fixpath');
var options = require('./options');
var LessImportInserter = require('less-import-inserter');
var exportDirectory = require('./exportDir');


// ------------------------
// Configure Moonboots
// ------------------------
module.exports = {
    jsFileName: 'app',
    cssFileName: 'app',
    main: fixPath('client/main.jsx'),
    developmentMode: !options.minify,
    resourcePrefix: options.build ? '/assets/' : '/',
    libraries: [
        fixPath('client/libraries/firebase.js'),
        fixPath('client/libraries/google-analytics.js'),
    ],
    stylesheets: [fixPath('styles/app.css')],
    browserify: {
        extensions: ['.jsx'],
        transforms: [
            'babelify',
            ['reactify', {es6: true}]
        ]
    },
    beforeBuildJS: function () {
        exportDirectory('client/pages');
        exportDirectory('client/stores');
    },
    beforeBuildCSS: function (cb) {
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
    }
};
