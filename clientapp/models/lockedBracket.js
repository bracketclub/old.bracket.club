var HumanModel = require('human-model');
var BracketScorer = require('bracket-scorer');
var BracketData = require('bracket-data');
var _ = require('underscore');
var baseBracket = require('../helpers/bracket');


module.exports = HumanModel.define(baseBracket({
    history: true,
    base: {
        initialize: function (attributes, options) {
            options || (options = {});
            
            this.masters = options.masters;
            this.scorer = new BracketScorer(_.extend({entry: this.entryBracket}, window.bootstrap.sportYear));
            this.constants = new BracketData(_.extend({props: ['constants']}, window.bootstrap.sportYear)).constants;

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
                return this.scorer.score(['standard', 'gooley', 'rounds', 'standardPPR', 'gooleyPPR'], {master: this.current});
            }
        }
    }
}));
