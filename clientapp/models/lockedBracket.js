var HumanModel = require('human-model');
var BracketScorer = require('bracket-scorer');
var BracketData = require('bracket-data');
var _ = require('underscore');
var bracketHistory = require('../helpers/bracket');


module.exports = HumanModel.define(_.extend(bracketHistory.methods, {
    type: 'bracket',
    initialize: function (attributes, options) {
        options || (options = {});
        this.masters = options.masters || app.masters;
        this.scorer = new BracketScorer(_.extend(window.bootstrap.sportYear, {entry: this.entryBracket}));
        this.constants = new BracketData(_.extend(window.bootstrap.sportYear, {props: ['constants']})).constants;
    },
    session: {
        entryBracket: ['string', true]
    },
    derived: _.extend(bracketHistory.derived, {
        history: {
            deps: [],
            cache: false,
            fn: function () {
                return this.masters.history;
            }
        },
        historyIndex: {
            deps: [],
            cache: false,
            fn: function () {
                return this.masters.historyIndex;
            }
        },
        expandedBracket: {
            deps: ['current'],
            cache: true,
            fn: function () {
                return this.scorer.diff({master: this.current});
            }
        },
        score: {
            deps: ['current'],
            cache: true,
            fn: function () {
                return this.scorer.score(['standard', 'gooley', 'rounds'], {master: this.current});
            }
        }
    })
}));
