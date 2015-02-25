let BracketScorer = require('bracket-scorer');
let pick = require('lodash/object/pick');
let without = require('lodash/array/without');
let Bracket = require('./bracket');


module.exports = Bracket.extend({
    scoreTypes: ['standard', 'gooley', 'rounds', 'standardPPR', 'gooleyPPR'],
    props: {
        progressText: ['string', true, 'games completed'],
        entry: 'string',
        standard: 'number',
        standardPPR: 'number',
        gooley: 'number',
        gooleyPPR: 'number',
        rounds: 'array'
    },
    initialize () {
        Bracket.prototype.initialize.apply(this, arguments);
        this.listenTo(this, 'change:current', this.calculateScores);
        this.calculateScores();
    },
    createHelpers () {
        this.scorer = new BracketScorer(this.sportYear);
        Bracket.prototype.createHelpers.apply(this, arguments);
    },
    calculateScores () {
        if (!this.current) return;
        this.setScores(this.scorer.score(this.scoreTypes, {master: this.current}));
    },
    setScores (scores) {
        this.set(pick(scores, without(this.scoreTypes, 'rounds')));
        scores.rounds.forEach(function (round, index) {
            this['rounds' + index] = round;
        }, this);
    },
    getBracketObject () {
        // A locked bracket will be rendered with the all its
        // correct/incorrect picks so we use the scorer's diff
        return this.scorer.diff({master: this.current, entry: this.entry});
    }
});
