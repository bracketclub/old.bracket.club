var HumanModel = require('human-model');


module.exports = HumanModel.define({
    type: 'sortOptions',
    session: {
        order: ['string', true, 'desc'],
        sortBy: ['string', true, 'standard'],
        game: ['number', true, window.bootstrap.masters.length - 1]
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
