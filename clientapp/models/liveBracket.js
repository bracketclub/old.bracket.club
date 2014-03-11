var HumanModel = require('human-model');
var baseBracket = require('../helpers/bracket');
var templates = require('../templates');


module.exports = HumanModel.define(baseBracket({
    history: true,
    base: {
        afterInit: function () {
            this.needsEmptyBase && this.setEmptyBase();
        },
        reset: function () {
            this.historyIndex = 0;
            this.history = [this.constants.EMPTY];
            this.save();
        },
        setAsLower: function () {
            this.updateBracket(this.generator.generate('lower'));
        },
        setAsHigher: function () {
            this.updateBracket(this.generator.generate('higher'));
        },
        setAsRandom: function () {
            this.updateBracket(this.generator.generate('random'));
        },
        setEmptyBase: function () {
            this.history.unshift(this.constants.EMPTY);
            this.history.length === 1 ? this.historyIndex = 0 : this.historyIndex++;
        },
        updateBracket: function (bracket) {
            if (bracket === this.current) return;
            if (this.canFastForward) {
                this.history = this.history.slice(0, this.historyIndex + 1).concat(bracket);
            } else {
                this.history.push(bracket);
            }
            this.historyIndex = this.history.length - 1;
            this.save();
        },
        save: function () {
            app.localStorage('history', this.history);
            app.localStorage('historyIndex', this.historyIndex);
        }
    },
    derived: {
        needsEmptyBase: {
            deps: ['hasHistory', 'history'],
            cache: true,
            fn: function () {
                return this.history.length === 0 || this.history[0] !== this.constants.EMPTY;
            }
        },
        enterButton: {
            deps: ['complete'],
            cache: true,
            fn: function () {
                return this.complete ? templates.includes.tweetButton({
                    url: this.current,
                    text: 'Check out my bracket!'
                }) : '';
            }
        }
    }
}));