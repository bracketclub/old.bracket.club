var Backbone = require('backbone');
var _ = require('underscore');
var Router = require('./router');
var MainView = require('./views/main');
var Entries = require('./collections/entries');
var HistoryBracket = require('./models/historyBracket');
var User = require('./models/user');


module.exports = {
    // this is the the whole app initter
    blastoff: function () {
        // add the ability to bind/unbind/trigger events
        // to the main app object.
        _.extend(this, Backbone.Events);

        var self = window.app = this;

        this.masters = new HistoryBracket({
            history: window.bootstrap.masters,
            historyIndex: window.bootstrap.masters.length - 1
        });
        this.entries = new Entries(window.bootstrap.entries, {masters: this.masters});

        var me = window.me = new User({});

        // init our URL handlers and the history tracker
        this.router = new Router();
        this.history = Backbone.history;

        // wait for document ready to render our main view
        // this ensures the document has a body, etc.
        $(function () {
            // init/render our main view
            var mainView = self.view = new MainView({
                model: me,
                el: document.body
            }).render();

            // listen for new pages from the router
            self.router.on('newPage', mainView.setPage, mainView);

            // we have what we need, we can now start our router and show the appropriate page
            self.history.start({pushState: true, root: '/'});
        });
    },

    // This is how you navigate around the app.
    // this gets called by a global click handler that handles
    // all the <a> tags in the app.
    // it expects a url without a leading slash.
    // for example: "costello/settings".
    navigate: function (page, options) {
        var url = (page.charAt(0) === '/') ? page.slice(1) : page;
        app.history.navigate(url, _.defaults(options || {}, {trigger: true}));
    },

    localStorage: function (key, val) {
        var localStorageKey = 'tweetyourbracket.' + me.id;
        var storage = localStorage[localStorageKey] || '{}';
        var storageJSON;

        try {
            storageJSON = JSON.parse(storage);
        } catch (e) {
            storageJSON = {};
        }
        
        if (key && typeof val !== 'undefined') {
            storageJSON[key] = val;
            localStorage[localStorageKey] = JSON.stringify(storageJSON);
            return val;
        } else if (key) {
            return storageJSON[key];
        }
    },

    __reset: function () {
        var localStorageKey = 'tweetyourbracket.' + me.id;
        localStorage[localStorageKey] = JSON.stringify({});
    }
};

// run it
module.exports.blastoff();
