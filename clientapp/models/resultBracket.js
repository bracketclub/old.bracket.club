var _ = require('underscore');
var HistoryBracket = require('./historyBracket');


module.exports = HistoryBracket.extend({
    scoreTypes: ['standard', 'gooley', 'rounds', 'standardPPR', 'gooleyPPR'],
    props: {
        bracket: 'string',
        standard: 'number',
        standardPPR: 'number',
        gooley: 'number',
        gooleyPPR: 'number',
        rounds: 'array'
    },
    initialize: function () {
        this.createHelpers();
    },
    setScores: function (scores) {
        this.set(_.pick(scores, _.without(this.scoreTypes, 'rounds')));
        scores.rounds.forEach(function (round, index) {
            this['rounds' + index] = round;
        }, this);
    }
});
