/*global me, app*/
var Backbone = require('backbone');
var HomePage = require('./pages/home');
var CollabPage = require('./pages/collaborate');
var ResultsPage = require('./pages/results');
var UserPage = require('./pages/user');
var _404Page = require('./pages/404');
var Bracket = require('./models/bracket');
var InstantBracket = require('./models/instantBracket');
var Results = require('./collections/results');
var User = require('./models/user');
var BracketValidator = require('bracket-validator');
var bd = new BracketValidator({year: '2013'});
var _ = require('underscore');
var data = require('./data/2013.json');


var meData = function () {
    var meUser = null;
    if (app.localStorage('completed')) {
        meUser = {bracket: app.localStorage('completed'), username: 'me'};
    }
    return meUser;
};

var hasMe = function () {
    return _.find(data.entries, function (e) {
        return e.username === "me";
    });
};

module.exports = Backbone.Router.extend({
    routes: {
        '': 'entry',
        'bracket': 'entry',
        'bracket/:bracket': 'entry',

        'collaborate/:room': 'collaborate',
        'collaborate-set/:room': 'collaborateSet',

        'results': 'results',
        'results/me': 'userResultsMe',
        'results/:user': 'userResults',

        '*path': '_404'
    },

    // ------- ROUTE HANDLERS ---------
    entry: function (bracket) {
        var history = app.localStorage('history') || [];
        var historyIndex = app.localStorage('historyIndex') || 0;
        if (bracket && history.length === 0) {
            history = [bracket];
        }
        if (!history[0] || history[0] !== bd.constants.EMPTY) {
            history.unshift(bd.constants.EMPTY);
            history.length === 1 ? historyIndex = 0 : historyIndex++;
        }
        this.trigger('newPage', new HomePage({
            model: new Bracket({
                history: history,
                historyIndex: historyIndex
            })
        }));
    },

    collaborate: function (room) {
        this.trigger('newPage', new CollabPage({
            roomId: room,
            model: new InstantBracket({
                roomId: room
            })
        }));
    },

    collaborateSet: function (room) {
        var history = app.localStorage('history') || [];
        var historyIndex = app.localStorage('historyIndex') || 0;
        var data = {roomId: room};
        if (history[historyIndex]) {
            data.bracket = history[historyIndex];
        }
        console.log(data)
        this.trigger('newPage', new CollabPage({
            roomId: room,
            model: new InstantBracket(data)
        }));
    },

    results: function () {
        var userData = meData();
        if (userData && !hasMe()) {
            data.entries.push(userData);
        }
        this.trigger('newPage', new ResultsPage({
            collection: new Results(data.entries, {masters: data.masters}),
        }));
    },
    userResultsMe: function (user) {
        var userData = meData();
        if (userData) {
            this.trigger('newPage', new UserPage({
                model: new User(_.extend(userData, {masters: data.masters})),
            }));
        } else {
            this._404('User does not exist.');
        }
    },
    userResults: function (user) {
        var userData = _.find(data.entries, function (e) { return e.username.toLowerCase() === user.toLowerCase(); });
        if (userData) {
            this.trigger('newPage', new UserPage({
                model: new User(_.extend(userData, {masters: data.masters})),
            }));
        } else {
            this._404('User does not exist.');
        }
    },

    _404: function (msg) {
        this.trigger('newPage', new _404Page({message: msg}));
    }
});
