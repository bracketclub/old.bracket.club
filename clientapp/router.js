var Backbone = require('backbone');
var HomePage = require('./pages/entry');
var ResultsPage = require('./pages/results');
var UserPage = require('./pages/user');
var _404Page = require('./pages/404');
var Bracket = require('./models/liveBracket');
var RTCBracket = require('./models/rtcBracket');
var CollaboratePage = require('./pages/collaborate');


module.exports = Backbone.Router.extend({
    routes: {
        '': 'entry',

        'results': 'results',
        'user/:user': 'userResults',

        'collaborate/:room': 'collaborate',
        'collaborate/:room/:bracket': 'collaborate',

        ':bracket': 'tryBracket',

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
                model: user,
                masters: app.masters
            }));
        } else {
            this._404('User does not exist.');
        }
    },

    collaborate: function (room, bracket) {
        var data = {};

        if (bracket) {
            data.current = bracket;
        }

        this.trigger('newPage', new CollaboratePage({
            roomId: room,
            model: new RTCBracket(data)
        }));
    },

    tryBracket: function (bracket) {
        if (bracket.match(app.bracketRegex)) {
            this.entry(bracket);
        } else {
            this._404();
        }
    },

    _404: function (msg) {
        this.trigger('newPage', new _404Page({message: msg}));
    }
});
