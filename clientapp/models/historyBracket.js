var Bracket = require('./bracket');


module.exports = Bracket.extend({
    props: {
        historyIndex: ['number', true, 0],
        history: 'array'
    },
    derived: {
        canRewind: {
            deps: ['history', 'historyIndex'],
            fn: function () {
                return this.history.length > 0 && this.historyIndex > 0;
            }
        },
        canFastForward: {
            deps: ['history', 'historyIndex'],
            fn: function () {
                return this.history.length > 0 && this.historyIndex < this.history.length - 1;
            }
        },
        hasHistory: {
            deps: ['history', 'historyIndex'],
            fn: function () {
                return this.history.length > 1;
            }
        },
        needsEmptyBase: {
            deps: ['hasHistory', 'history'],
            fn: function () {
                return !this.history || this.history.length === 0 || this.history[0] !== this.constants.EMPTY;
            }
        }
    },
    initialize: function () {
        this.createHelpers();

        if (this.needsEmptyBase) {
            this.setEmptyBase();
        }

        this.listenTo(this, 'change:history change:historyIndex', this.updateCurrent);
        this.updateCurrent();

        this.listenTo(this, 'change:current', this.updateRegions);
        this.updateRegions();
    },
    updateCurrent: function () {
        this.current = this.history[this.historyIndex];
    },
    setEmptyBase: function () {
        this.history = [this.constants.EMPTY].concat(this.history || []);
        this.history.length === 1 ? this.historyIndex = 0 : this.historyIndex++;
    },

    // Manipulate position in history
    getPrevious: function (i) {
        this.historyIndex = Math.max(0, this.historyIndex - Math.abs(i || 1));
    },
    getNext: function (i) {
        this.historyIndex = Math.min(this.historyIndex + Math.abs(i || 1), this.history.length - 1);
    },
    getFirst: function () {
        this.historyIndex = 0;
    },
    getLast: function () {
        this.historyIndex = this.history.length - 1;
    },
    resetHistory: function () {
        this.historyIndex = 0;
        this.history = [this.constants.EMPTY];
    },

    // Add a new bracket to the history
    updateBracket: function (bracket) {
        if (bracket === this.current) return;
        if (this.canFastForward) {
            this.history = this.history.slice(0, this.historyIndex + 1).concat(bracket);
        } else {
            this.history = this.history.concat(bracket);
        }
        this.historyIndex = this.history.length - 1;
    },
});