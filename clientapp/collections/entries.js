var _ = require('lodash');
var Collection = require('ampersand-collection');
var underscoreMixin = require('ampersand-collection-underscore-mixin');
var BracketScorer = require('bracket-scorer');
var HistoryBracket = require('../models/historyBracket');
var ResultBracket = require('../models/resultBracket');
var User = require('../models/user').extend({
    initialize: function () {
        if (this.bracket) {
            var data = _.extend(_.pick(this, 'bracket'), _.pick(this.collection.options, 'sport', 'year'));
            this.bracket = new ResultBracket(data);
        }
    },
    serialize: function () {
        var res = this.getAttributes({props: true}, true);
        res.bracket = this.bracket.bracket;
        return res;
    }
});


module.exports = Collection.extend(underscoreMixin, {
    model: User,

    _scoreTypes: ['standard', 'gooley', 'rounds', 'standardPPR', 'gooleyPPR'],
    _scoreRounds: 6,
    _sortedBy: '',
    _sortOrder: 'desc',

    initialize: function (models, options) {
        this.options = options;
        options.silent = false;
        this.history = new HistoryBracket(_.pick(options, 'sport', 'year', 'history', 'historyIndex'));
        this._createScoreComparators();
        this.listenTo(this, 'reset', this.createScorer);
    },

    createScorer: function (collection, options) {
        this.scorer = new BracketScorer(_.extend({entry: this.toJSON()}, _.pick(options, 'sport', 'year')));
        this.listenTo(this.history, 'change:current', this.calculateScores);
        this.calculateScores();
    },
    calculateScores: function () {
        var scores = this.scorer.score(this._scoreTypes, {master: this.history.current});
        _.each(scores, function (score) {
            this.get(score.username).bracket.setScores(score.score);
        }, this);
    },
    scoreIndex: function (model) {
        var models = this.sortOrder === 'asc' ? _.clone(this.models).reverse() : this.models;
        // The index will always be based on the standard score
        return _.sortedIndex(models, model, function (entry) {
            return entry.bracket.score.standard;
        });
    },

    comparator: function (a, b) {
        var dir = this._sortOrder === 'asc' ? -1 : 1;
        var aScore, bScore;

        if (this._sortedBy && a.bracket && b.bracket) {
            aScore = this[this._sortedBy](a);
            bScore = this[this._sortedBy](b);

            if (aScore < bScore) return -1 * dir;
            if (bScore < aScore) return 1 * dir;
        }

        return (a.created - b.created) * dir;
    },

    // Helpers to curry score comparator fns
    _createScoreComparators: function () {
        this._scoreTypes.forEach(function (scoreType) {
            if (scoreType === 'rounds') {
                for (var i = 1, m = this._scoreRounds; i <= m; i++) {
                    this[scoreType + i] = _.partial(this._byScore, scoreType, i - 1); 
                }
            } else {
                this[scoreType] = _.partial(this._byScore, scoreType, null);
            }
            return scoreType;
        }, this);
    },
    _byScore: function (type, index, entry) {
        var score = entry.bracket[type];
        if (Array.isArray(score)) {
            score = score[index];
        }
        return -score;
    },

    setComparator: function (prop, order) {
        this._sortedBy = typeof this[prop] === 'function' ? prop : '';
        this._sortOrder = order || this._sortOrder;
        this.sort();
    }
});