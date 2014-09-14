var appName = require('../package').name;
var lessitizer = require('lessitizer');
var templatizer = require('templatizer');
var fixPath = require('./fixpath');
var options = require('./options');


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
        // Bootstrap modules
        fixPath('clientapp/libraries/bootstrap/transition.js'),
        fixPath('clientapp/libraries/bootstrap/alert.js'),
        fixPath('clientapp/libraries/bootstrap/button.js'),
        fixPath('clientapp/libraries/bootstrap/dropdown.js'),
        fixPath('clientapp/libraries/bootstrap/collapse.js'),
        fixPath('clientapp/libraries/bootstrap/modal.js'),
        fixPath('clientapp/libraries/bootstrap/affix.js'),
        fixPath('clientapp/libraries/bootstrap/tooltip.js'),
        fixPath('clientapp/libraries/bootstrap/popover.js')
    ],
    stylesheets: [fixPath('styles/app.css')],
    beforeBuildJS: function () {
        templatizer(fixPath('clienttemplates'), fixPath('clientapp/templates.js'));
    },
    beforeBuildCSS: function (cb) {
        lessitizer({
            files: fixPath('styles/app.less'),
            outputDir: fixPath('styles')
        }, cb);
    }
};
