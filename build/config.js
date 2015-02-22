var appName = require('../package').name;
var lessitizer = require('lessitizer');
var fixPath = require('./fixpath');
var options = require('./options');
var LessImportInserter = require('less-import-inserter');
var exportDirectory = function (dir) {
    var files = require('fs').readdirSync(fixPath(dir));
    console.log(files)
};


// ------------------------
// Configure Moonboots
// ------------------------
module.exports = {
    jsFileName: appName,
    cssFileName: appName,
    main: fixPath('clientapp/main.jsx'),
    developmentMode: !options.minify,
    resourcePrefix: (options.build || options.crawl) ? '/assets/' : '/',
    libraries: [
        //fixPath('clientapp/libraries/google-analytics.js')
    ],
    stylesheets: [fixPath('styles/app.css')],
    browserify: {
        extensions: ['.jsx'],
        transforms: [
            'babelify',
            ['reactify', {es6: true}],
            'brfs',
        ]
    },
    beforeBuildJS: function () {
        exportDirectory('../clientapp/pages');
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
                            'theme/variables.less',
                            'theme/override.less'
                        ]
                    },
                    append: 'app/app.less'
                }).build(),
                filename: 'app'
            },
            outputDir: fixPath('styles')
        }, cb);
    }
};
