var HistoryBracket = require('./historyBracket');


module.exports = HistoryBracket.extend({
    props: {
        progressText: ['string', true, 'picks made']
    },
    generate: function (type) {
        this.updateBracket(this.generator.generate(type));
    },
    resetHistory: function () {
        HistoryBracket.prototype.resetHistory.apply(this, arguments);
        this.save();
    },
    updateBracket: function () {
        HistoryBracket.prototype.updateBracket.apply(this, arguments);
        this.save();
    },
    save: function () {
        if (typeof app !== 'undefined' && app.localStorage) {
            app.localStorage('history', this.history);
            app.localStorage('historyIndex', this.historyIndex);
        }
    }
});