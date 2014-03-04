var HumanModel = require('human-model');
var BracketValidator = require('bracket-validator');
var BracketUpdater = require('bracket-updater');
var BracketData = require('bracket-data');
var _ = require('underscore');
var bracketHistory = require('../helpers/bracket');


module.exports = HumanModel.define(_.extend(bracketHistory.methods, {
    type: 'bracket',
    initialize: function () {
        this.updater = new BracketUpdater(window.bootstrap.sportYear);
        this.validator = new BracketValidator(window.bootstrap.sportYear);
        this.constants = new BracketData(_.extend(window.bootstrap.sportYear, {props: ['constants']})).constants;
        this.needsEmptyBase && this.setEmptyBase();
    },
    session: {
        historyIndex: ['number', true, 0],
        history: ['array', true, []]
    },
    derived: _.extend(bracketHistory.derived, {
        expandedBracket: {
            deps: ['current'],
            cache: true,
            fn: function () {
                return this.validator.validate(this.current);
            }
        }
    }),
    updateBracket: function (bracket) {
        if (this.canFastForward) {
            this.history = this.history.slice(0, this.historyIndex + 1).concat(bracket);
        } else {
            this.history.push(bracket);
        }
        this.historyIndex = this.history.length - 1;
    },
    updateGame: function (winner, loser, region) {
        var data = {
            winner: winner,
            fromRegion: region,
            currentMaster: this.current
        };
        loser && (data.loser = loser);
        var update = this.updater.update(data);

        if (update instanceof Error) {
            this.trigger('invalid', this, update);
        } else if (update !== this.current) {
            this.updateBracket(update);
        }
    }
}));
