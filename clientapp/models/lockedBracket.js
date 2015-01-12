var BracketScorer = require('bracket-scorer');
var _ = require('underscore');
var ResultBracket = require('./resultBracket');
var HistoryBracket = require('./HistoryBracket');


module.exports = ResultBracket.extend({
    initialize: function () {
        HistoryBracket.prototype.initialize.apply(this, arguments);
        this.listenTo(this, 'change:current', this.calculateScores);
        this.calculateScores();
    },
    createHelpers: function () {
        this.scorer = new BracketScorer(_.extend({entry: this.bracket}, this.sportYear));
        HistoryBracket.prototype.createHelpers.apply(this, arguments);
    },
    calculateScores: function () {
        if (!this.current) return;
        this.setScores(this.scorer.score(this.scoreTypes, {master: this.current}));
    },
    getBracketObject: function () {
        // A locked bracket will be rendered with the all its
        // correct/incorrect picks so we use the scorer's diff
        return this.scorer.diff({master: this.current});
    }
});
