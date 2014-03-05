var _ = require('underscore');
var changeEventArray = require('./changeEventArray');
var BracketValidator = require('bracket-validator');
var BracketUpdater = require('bracket-updater');
var BracketData = require('bracket-data');
var definition = {
    derived: {
        current: {
            deps: ['history', 'historyIndex'],
            cache: true,
            fn: function () {
                return this.history[this.historyIndex] || this.constants.EMPTY;
            }
        },
        complete: {
            deps: ['current'],
            cache: true,
            fn: function () {
                return this.current.indexOf(this.constants.UNPICKED_MATCH) === -1;
            }
        },
        progressNow: {
            deps: ['current', 'progressTotal'],
            cache: true,
            fn: function () {
                return this.progressTotal - this.current.replace(new RegExp('[^' + this.constants.UNPICKED_MATCH + ']', 'gi'), '').length;
            }
        },
        progressTotal: {
            deps: [],
            cache: true,
            fn: function () {
                return ((this.constants.TEAMS_PER_REGION * this.constants.REGION_COUNT) - 1);
            }
        },
        percent: {
            deps: ['progressTotal', 'progressNow'],
            cache: true,
            fn: function () {
                return  (this.progressNow / this.progressTotal) * 100;
            }
        },
        ordered: {
            deps: ['expandedBracket'],
            cache: true,
            fn: function () {
                var v = this.expandedBracket;

                if (v instanceof Error) {
                    this.trigger('invalid', this, v);
                    return null;
                }

                var f = v[this.constants.FINAL_ID];
                var first = v[this.constants.REGION_IDS[0]];
                var second = v[first.sameSideAs];
                var others = _.reject(v, function (r) { return _.contains([f.id, first.id, second.id], r.id); });
                return [first, v[first.sameSideAs], others[0], others[1], f];
            }
        },
        canRewind: {
            deps: ['history', 'historyIndex'],
            cache: true,
            fn: function () {
                return this.history.length > 0 && this.historyIndex > 0;
            }
        },
        canFastForward: {
            deps: ['history', 'historyIndex'],
            cache: true,
            fn: function () {
                return this.history.length > 0 && this.historyIndex < this.history.length - 1;
            }
        },
        hasHistory: {
            deps: ['history', 'historyIndex'],
            cache: true,
            fn: function () {
                return this.history.length > 1;
            }
        },
        expandedBracket: {
            deps: ['current'],
            cache: true,
            fn: function () {
                return this.validator.validate(this.current);
            }
        }
    },
    session: {
        historyIndex: ['number', true, 0],
        history: ['array', true, []]
    },
    base: {
        type: 'bracket',
        initialize: function () {
            this.updater = new BracketUpdater(window.bootstrap.sportYear);
            this.validator = new BracketValidator(window.bootstrap.sportYear);
            this.constants = new BracketData(_.extend(window.bootstrap.sportYear, {props: ['constants']})).constants;
            this.afterInit && this.afterInit();
        },
        previous: function () {
            this.historyIndex = Math.max(0, this.historyIndex - 1);
        },
        next: function () {
            this.historyIndex = Math.min(this.historyIndex + 1, this.history.length - 1);
        },
        first: function () {
            this.historyIndex = 0;
        },
        last: function () {
            this.historyIndex = this.history.length - 1;
        },
        navEvents: function () {
            return changeEventArray('hasHistory canFastForward canRewind percent progressTotal progressNow');
        }
    }
};

module.exports = function (options) {
    options || (options = {});
    return _.extend({}, definition.base, options.base || {}, {
        session: _.extend({}, definition.session, options.session || {}),
        derived: _.extend({}, definition.derived, options.derived || {})
    });
};