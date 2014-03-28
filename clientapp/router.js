var Backbone = require('backbone');
var HomePage = require('./pages/entry');
var ResultsPage = require('./pages/results');
var UserPage = require('./pages/user');
var _404Page = require('./pages/404');
var Bracket = require('./models/liveBracket');
var RTCBracket = require('./models/rtcBracket');
var SortOptions = require('./models/sortOptions');
var CollaboratePage = require('./pages/collaborate');
var _ = require('underscore');
var qsParse = require('querystring').parse;
var currentQS = function () {
    return qsParse(window.location.search.slice(1));
};


module.exports = Backbone.Router.extend({
    routes: {
        '': 'entry',

        'results': 'results',
        'results?*qs': 'results',
        'user/:user': 'userResults',

        'collaborate/:room': 'collaborate',
        'collaborate/:room/:bracket': 'collaborate',
        'video/:room': 'videoOnly',
        'video/:room/:bracket': 'videoOnly',

        ':bracket': 'tryBracket',
        ':bracket/:entered': 'tryBracket',

        '*path': '_404'
    },

    // ------- ROUTE HANDLERS ---------
    entry: function (bracket, entered) {
        var props = {};
        var history = app.localStorage('history');
        var historyIndex = app.localStorage('historyIndex');

        // If we have local storage 
        if (_.isArray(history) && _.isNumber(historyIndex)) {
            // No url bracket, use local storage
            if (!bracket) {
                props.history = history;
                props.historyIndex = historyIndex;
            }
            // If localstorage matches the url use that
            else if (history[historyIndex] === bracket) {
                props.history = history;
                props.historyIndex = historyIndex;
            }
            // If our url bracket is somewhere in the history
            // use that bracket but keep our history
            else if (_.contains(history, bracket)) {
                props.history = history;
                props.historyIndex = _.lastIndexOf(history, bracket);
            }
            // Our url bracket is nowhere in our history
            // the url takes precedence so we start over with that
            else {
                props.history = [bracket];
            }
        }
        // If we have no local storage but we have a bracket
        else if (bracket) {
            props.history = [bracket];
        }

        if (props.history) {
            props.history = _.compact(props.history);
        }

        // If we didnt set some props they will be handled by the defaults
        this.trigger('newPage', new HomePage({
            model: new Bracket(props),
            fromEntry: entered === 'entered'
        }));
    },

    results: function () {
        var qs = currentQS();
        var sortOptions = {};
        var gameIndex = parseInt(qs.game, 10);

        if (qs.order === 'asc' || qs.order === 'desc') {
            sortOptions.order = qs.order;
        }

        if (typeof gameIndex === 'number' && !isNaN(gameIndex)) {
            sortOptions.game = gameIndex;
        }

        if (qs.sortBy) {
            sortOptions.sortBy = qs.sortBy;
        }

        this.trigger('newPage', new ResultsPage({
            collection: app.entries,
            sortOptions: new SortOptions(sortOptions),
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
            this._404({
                message: 'This user does not exist.',
                text: 'If you just tweeted this entry, it may take up to 10 minutes for it to be visible here.'
            });
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
    videoOnly: function (room, bracket) {
        var data = {};

        if (bracket) {
            data.current = bracket;
        }

        this.trigger('newPage', new CollaboratePage({
            roomId: room,
            videoOnly: true,
            model: new RTCBracket(data)
        }));
    },

    tryBracket: function (bracket, entered) {
        if (bracket.match(app.bracketRegex)) {
            this.entry(bracket, entered);
        } else {
            this._404();
        }
    },

    _404: function (options) {
        this.trigger('newPage', new _404Page(options));
    }
});
