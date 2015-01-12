var BracketScorer = require('bracket-scorer');
var _ = require('underscore');
var HistoryBracket = require('./historyBracket');


module.exports = HistoryBracket.extend({
    props: {
        bracket: 'string'
    },
    createHelpers: function () {
        this.scorer = new BracketScorer(_.extend({entry: this.bracket}, this.sportYear));
        HistoryBracket.prototype.createHelpers.apply(this, arguments);
    },
    getBracketObject: function () {
        // A locked bracket will be rendered with the all its
        // correct/incorrect picks so we use the scorer's diff
        return this.scorer.diff({master: this.current});
    },
    derived: {
        score: {
            deps: ['current'],
            fn: function () {
                return this.scorer.score(
                    ['standard', 'gooley', 'rounds', 'standardPPR', 'gooleyPPR'],
                    {master: this.current}
                );
            }
        }
    }
});
