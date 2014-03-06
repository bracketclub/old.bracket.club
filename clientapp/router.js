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
        'bracket': 'entry',
        'bracket/:bracket': 'entry',

        'results': 'results',
        'user/:user': 'userResults',

        'collaborate/:room': 'collaborate',
        'collaborate/:room/:bracket': 'collaborate',

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
        if (bracket) app.navigate('/collaborate/' + room, {trigger: false, replace: true});
        this.trigger('newPage', new CollaboratePage({
            roomId: room,
            model: new RTCBracket({
                current: bracket
            })
        }));
    },

    _404: function (msg) {
        this.trigger('newPage', new _404Page({message: msg}));
    }
});
