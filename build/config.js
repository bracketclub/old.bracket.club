var appName = require('../package').name;
var lessitizer = require('lessitizer');
var templatizer = require('templatizer');
var fixPath = require('./fixpath');
var options = require('./options');
var LessImportInserter = require('less-import-inserter');


// ------------------------
// Configure Moonboots
// ------------------------
module.exports = {
    jsFileName: appName,
    cssFileName: appName,
    main: fixPath('clientapp/app-react.jsx'),
    developmentMode: !options.minify,
    resourcePrefix: (options.build || options.crawl) ? '/assets/' : '/',
    libraries: [
        fixPath('clientapp/libraries/google-analytics.js')
    ],
    stylesheets: [fixPath('styles/app.css')],
    browserify: {
        extensions: ['.jsx'],
        transforms: [['reactify', {es6: true}]]
    },
    beforeBuildJS: function () {
        templatizer(fixPath('clienttemplates'), fixPath('clientapp/templates.js'));
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
