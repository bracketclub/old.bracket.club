let pick = require('lodash/object/pick');
let without = require('lodash/array/without');
let Bracket = require('./base');


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
    calculateScores () {
        if (!this.current) return;
        this.setScores(this.scorer.score(this.scoreTypes, {master: this.current}));
    },
    setScores (scores) {
        this.set(pick(scores, without(this.scoreTypes, 'rounds')));
        scores.rounds.forEach(function (round, index) {
            this['rounds' + index] = round;
        }, this);
    }
});
