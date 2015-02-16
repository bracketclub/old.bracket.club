var React = require('react');
var _ = require('underscore');
var attachFastClick = require('fastclick');
var qs = require('qs');
var BracketData = require('bracket-data');
var State = require('ampersand-state');

var Bracket = require('./react/bracket');
var MainView = require('./views/main');
var Entries = require('./collections/entries');
var HistoryBracket = require('./models/historyBracket');
var User = require('./models/user');
var Countdown = require('./helpers/countdown');


var App = new State({
    children: {
        me: User,
        locked: Countdown,
        time: Countdown,
        masters: HistoryBracket
    },

    collections: {
        entries: Entries
    },

    props: {
        bracketRegex: 'string',
        name: ['string', true, 'Tweet Your Bracket'],
        id: ['string', true, 'tweetyourbracket'],
        sport: 'string',
        year: 'string',
        newUser: 'boolean'
    },

    derived: {
        lsKey: {
            deps: ['id', 'sport', 'year'],
            fn: function () {
                return [this.id, this.sport, this.year].join('.');
            }
        }
    },

    initialize: function () {
        var username = this.localStorage('username');
        if (username) {
            this.me.username = username;
        }

        this.newUser = this.isNewUser();

        React.renderComponent(Bracket, document.body);

        // this.view = new MainView({
        //     el: document.body,
        //     model: this,
        //     me: this.me,
        //     locked: this.locked,
        //     time: this.time
        // });
        // this.navigate = this.view.navigate;

        // $(_.bind(function () {
        //     attachFastClick(document.body);
        //     this.view.render();
        // }, this));
    },

    isNewUser: function () {
        if (app.localStorage('isNewUser') !== false) {
            // No longer a new user
            app.localStorage('isNewUser', false);
            return true;
        } else {
            return false;
        }
    },

    bracketNavigate: function (model, bracket) {
        var url = window.location.pathname;
        var matches = url.match(app.bracketRegex);
        if (matches && matches.length) {
            url = url.replace(app.bracketRegex, bracket);
        } else {
            url += ('/' + bracket);
        }
        url = url.replace(new RegExp('(' + bracket + ')' + '/entered'), '$1');
        this.navigate(url, {trigger: false, replace: true});
    },

    qsNavigate: function (model) {
        var url = window.location.pathname;
        this.navigate(url + '?' + qs.stringify(model.toJSON()), {trigger: false});
    },

    localBracket: function () {
        var currentModel = app.currentPage && app.currentPage.model;
        var history = app.localStorage('history');
        var historyIndex = app.localStorage('historyIndex');

        if (currentModel) {
            return currentModel.current;
        } else {
            return history && historyIndex && history[historyIndex];
        }
    },

    logout: function () {
        this.me.clear();
        this.localStorage('username', null);
    },

    localStorage: function (key, val) {
        var localStorageKey = this.lsKey;
        var current = localStorage[localStorageKey] || '{}';

        try {
            current = JSON.parse(current);
        } catch (e) {
            current = {};
        }
        
        if (key && typeof val !== 'undefined') {
            current[key] = val;
            localStorage[localStorageKey] = JSON.stringify(current);
            return val;
        } else if (key) {
            return current[key];
        }
    },

    __reset: function () {
        localStorage[this.lsKey] = '{}';
    }
});


var bsData = window.bootstrap;
var bracketData = new BracketData(_.extend({
    props: ['regex', 'locks']
}, bsData.sportYear));


window.app = new App({
    bracketRegex: bracketData.regex,
    locked: {
        time: bracketData.locks
    },
    time: {
        time: window.__timestamp,
        stopAtZero: false
    },
    masters: {
        history: bsData.masters,
        historyIndex: bsData.masters.length - 1
    },
    entries: bsData.entries
});
