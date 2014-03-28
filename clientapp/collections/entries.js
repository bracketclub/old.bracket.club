var Backbone = require('backbone');
var _ = require('underscore');
var User = require('../models/user');


module.exports = Backbone.Collection.extend({
    model: User,
    sortedBy: 'standard',
    sortOrder: 'desc',
    comparator: function (a, b) {
        return this.byDate(a, b);
    },
    scoreIndex: function (model) {
        var models = this.sortOrder === 'asc' ? _.clone(this.models).reverse() : this.models;
        return _.sortedIndex(models, model, function (m) {
            return typeof m.bracket === 'undefined' ? 0 : this[this.sortedBy](m);
        }, this);
    },
    byScore: function (a, b) {
        if (typeof a.bracket === 'undefined' || typeof b.bracket === 'undefined') return 0;

        var aScore = this[this.sortedBy](a);
        var bScore = this[this.sortedBy](b);

        if (aScore < bScore) return -1;
        if (bScore < aScore) return 1;

        return 0;
    },
    byDate: function (a, b) {
        return a.createdMoment.isBefore(b.createdMoment) ? -1 : 1;
    },
    standard: function (m) {
        return -m.bracket.score.standard;
    },
    standardPPR: function (m) {
        return -m.bracket.score.standardPPR;
    },
    gooley: function (m) {
        return -m.bracket.score.gooley;
    },
    gooleyPPR: function (m) {
        return -m.bracket.score.gooleyPPR;
    },
    round1: function (m) {
        return -m.bracket.score.rounds[0];
    },
    round2: function (m) {
        return -m.bracket.score.rounds[1];
    },
    round3: function (m) {
        return -m.bracket.score.rounds[2];
    },
    round4: function (m) {
        return -m.bracket.score.rounds[3];
    },
    round5: function (m) {
        return -m.bracket.score.rounds[4];
    },
    round6: function (m) {
        return -m.bracket.score.rounds[5];
    },
    setComparator: function (prop, order) {
        var setSortedBy = typeof this[prop] === 'function';

        if (setSortedBy) {
            this.sortedBy = prop;
        }

        this.sortOrder = order;

        this.comparator = _.bind(function (a, b) {
            var byScore = this.byScore(a, b) * (this.sortOrder === 'asc' ? -1 : 1);
            if (byScore !== 0) return byScore;
            return this.byDate(a, b);
        }, this);
    },
    changeComparatorAndSort: function (prop, order) {
        this.setComparator(prop, order);
        this.sort();
    }
});