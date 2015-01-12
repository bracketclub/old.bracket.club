var State = require('./base');


module.exports = State.extend({
    props: {
        order: ['string', true, 'desc'],
        sortBy: ['string', true, 'standard'],
        game: ['number', true, 0]
    },
    setSortBy: function (sortBy) {
        var current = this.sortBy;
        var attrs = {};
        if (sortBy === current) {
            attrs.order = this.order === 'desc' ? 'asc' : 'desc';
        }
        attrs.sortBy = sortBy;
        this.set(attrs);
    }
});
