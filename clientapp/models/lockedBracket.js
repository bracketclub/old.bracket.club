var BracketScorer = require('bracket-scorer');
var extend = require('lodash/object/extend');
var pick = require('lodash/object/pick');
var without = require('lodash/array/without');
var Bracket = require('./bracket');


// scoreTypes: 
// props: {
//     bracket: 'string',
//     standard: 'number',
//     standardPPR: 'number',
//     gooley: 'number',
//     gooleyPPR: 'number',
//     rounds: 'array'
// },
// initialize: function () {
//     this.createHelpers();
// },


module.exports = Bracket.extend({
    scoreTypes: ['standard', 'gooley', 'rounds', 'standardPPR', 'gooleyPPR'],
    initialize: function () {
        Bracket.prototype.initialize.apply(this, arguments);
        this.listenTo(this, 'change:current', this.calculateScores);
        this.calculateScores();
    },
    createHelpers: function () {
        this.scorer = new BracketScorer(extend({entry: this.bracket}, this.sportYear));
        Bracket.prototype.createHelpers.apply(this, arguments);
    },
    calculateScores: function () {
        if (!this.current) return;
        this.setScores(this.scorer.score(this.scoreTypes, {master: this.current}));
    },
    setScores: function (scores) {
        this.set(pick(scores, without(this.scoreTypes, 'rounds')));
        scores.rounds.forEach(function (round, index) {
            this['rounds' + index] = round;
        }, this);
    },
    getBracketObject: function () {
        // A locked bracket will be rendered with the all its
        // correct/incorrect picks so we use the scorer's diff
        return this.scorer.diff({master: this.current});
    }
});
