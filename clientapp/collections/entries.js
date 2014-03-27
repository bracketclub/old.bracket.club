var Backbone = require('backbone');
var _ = require('underscore');
var User = require('../models/user');


module.exports = Backbone.Collection.extend({
    model: User,
    comparator: function (m) {
        return this.standard(m);
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
    changeComparator: function (prop) {
        this.comparator = _.bind(function (model) {
            return typeof this[prop] === 'function' ? this[prop](model) : this.standard(model);
        }, this);
        this.sort();
    }
});