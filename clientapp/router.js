var Backbone = require('backbone');
var HomePage = require('./pages/home');
var ResultsPage = require('./pages/results');
var UserPage = require('./pages/user');
var _404Page = require('./pages/404');
var Bracket = require('./models/liveBracket');


module.exports = Backbone.Router.extend({
    routes: {
        '': 'entry',
        'bracket': 'entry',
        'bracket/:bracket': 'entry',

        'results': 'results',
        'user/:user': 'userResults',

        ':bracket': 'tryEntry',
        '*path': '_404'
    },

    // ------- ROUTE HANDLERS ---------
    entry: function (bracket) {
        var props = {};
        var history, historyIndex;

        if (bracket) {
            props.history = [bracket];
            props.historyIndex = 0;
        } else {
            history = app.localStorage('history');
            history && history.length && (props.history = history);
            historyIndex = app.localStorage('historyIndex');
            historyIndex && typeof historyIndex === 'number' && (props.historyIndex = historyIndex);
        }

        this.trigger('newPage', new HomePage({
            model: new Bracket(props)
        }));
    },

    results: function () {
        this.trigger('newPage', new ResultsPage({
            collection: app.entries,
            model: app.masters
        }));
    },
    userResults: function (username) {
        var user = app.entries.findWhere({username: username});
        if (user) {
            this.trigger('newPage', new UserPage({
                model: user
            }));
        } else {
            this._404('User does not exist.');
        }
    },

    _404: function (msg) {
        this.trigger('newPage', new _404Page({message: msg}));
    }
});
