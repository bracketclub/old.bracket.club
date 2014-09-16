var appName = require('../package').name;
var lessitizer = require('lessitizer');
var templatizer = require('templatizer');
var fixPath = require('./fixpath');
var options = require('./options');
var Bootstrap = require('./bootstrap');


// ------------------------
// Configure Moonboots
// ------------------------
module.exports = {
    jsFileName: appName,
    cssFileName: appName,
    main: fixPath('clientapp/app2.js'),
    developmentMode: !options.minify,
    resourcePrefix: options.build || options.crawl ? '/assets/' : '/',
    libraries: [
        fixPath('clientapp/libraries/google-analytics.js'),
        fixPath('node_modules/jquery/dist/jquery.js'),
        fixPath('clientapp/libraries/typeahead.bundle.js'),
        fixPath('node_modules/bootstrap/js/transition.js'),
        fixPath('node_modules/bootstrap/js/alert.js'),
        fixPath('node_modules/bootstrap/js/button.js'),
        fixPath('node_modules/bootstrap/js/dropdown.js'),
        fixPath('node_modules/bootstrap/js/collapse.js'),
        fixPath('node_modules/bootstrap/js/modal.js'),
        fixPath('node_modules/bootstrap/js/affix.js'),
        fixPath('node_modules/bootstrap/js/tooltip.js'),
        fixPath('node_modules/bootstrap/js/popover.js')
    ],
    stylesheets: [fixPath('styles/app.css')],
    beforeBuildJS: function () {
        templatizer(fixPath('clienttemplates'), fixPath('clientapp/templates.js'));
    },
    beforeBuildCSS: function (cb) {
        lessitizer({
            developmentMode: !options.minify,
            files: {
                less: new Bootstrap({
                    override: [
                        'styles/theme/variables.less',
                        'styles/theme/override.less'
                    ],
                    append: [
                        'styles/app/app.less'
                    ]
                })
            },
            outputDir: fixPath('styles')
        }, cb);
    }
};
