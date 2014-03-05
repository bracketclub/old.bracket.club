var HumanModel = require('human-model');
var BracketScorer = require('bracket-scorer');
var BracketData = require('bracket-data');
var _ = require('underscore');
var baseBracket = require('../helpers/historyBracket');


module.exports = HumanModel.define(baseBracket({
    base: {
        initialize: function (attributes, options) {
            options || (options = {});
            
            this.masters = options.masters;
            this.scorer = new BracketScorer(_.extend(window.bootstrap.sportYear, {entry: this.entryBracket}));
            this.constants = new BracketData(_.extend(window.bootstrap.sportYear, {props: ['constants']})).constants;

            this.listenTo(this.masters, 'change:history change:historyIndex', this.syncFromMaster);
            this.syncFromMaster();
        },
        syncFromMaster: function () {
            this.history = this.masters.history;
            this.historyIndex = this.masters.historyIndex;
        }
    },
    session: {
        entryBracket: ['string', true]
    },
    derived: {
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
    }
}));
