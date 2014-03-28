var _ = require('underscore');
var BracketValidator = require('bracket-validator');
var BracketUpdater = require('bracket-updater');
var BracketGenerator = require('bracket-generator');
var BracketData = require('bracket-data');
var templates = require('../templates');

var historyDefinition = {
    derived: {
        rewindClass: {
            deps: ['canRewind'],
            cache: true,
            fn: function () {
                return this.canRewind ? '' : 'disabled';
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
        fastForwardClass: {
            deps: ['canFastForward'],
            cache: true,
            fn: function () {
                return this.canFastForward ? '' : 'disabled';
            }
        },
        hasHistory: {
            deps: ['history', 'historyIndex'],
            cache: true,
            fn: function () {
                return this.history.length > 1;
            }
        },
        resetClass: {
            deps: ['hasHistory'],
            cache: true,
            fn: function () {
                return this.hasHistory ? '' : 'disabled';
            }
        },
        current: {
            deps: ['history', 'historyIndex'],
            cache: true,
            fn: function () {
                return this.history[this.historyIndex] || this.constants.EMPTY;
            }
        },
        hasStarted: {
            deps: ['history'],
            cache: true,
            fn: function () {
                return this.history.length > 1;
            }
        }
    },
    session: {
        historyIndex: ['number', true, 0],
        history: ['array', true, window.bootstrap.masters.slice(0, 1)]
    },
    base: {
        previousHistory: function () {
            this.historyIndex = Math.max(0, this.historyIndex - 1);
        },
        nextHistory: function () {
            this.historyIndex = Math.min(this.historyIndex + 1, this.history.length - 1);
        },
        firstHistory: function () {
            this.historyIndex = 0;
        },
        lastHistory: function () {
            this.historyIndex = this.history.length - 1;
        }
    }
};
var definition = {
    derived: {
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
                return (this.constants.TEAMS_PER_REGION * this.constants.REGION_COUNT) - 1;
            }
        },
        percent: {
            deps: ['progressTotal', 'progressNow'],
            cache: true,
            fn: function () {
                return  (this.progressNow / this.progressTotal) * 100;
            }
        },
        hasStarted: {
            deps: ['progressNow'],
            cache: true,
            fn: function () {
                return this.progressNow > 0;
            }
        },
        progressBar: {
            deps: ['percent', 'progressText', 'progressNow', 'progressTotal'],
            cache: true,
            fn: function () {
                return templates.includes.progressBar({
                    progressNow: this.progressNow,
                    progressTotal: this.progressTotal,
                    percent: this.percent,
                    progressText: this.progressText
                });
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
        expandedBracket: {
            deps: ['current'],
            cache: true,
            fn: function () {
                return this.validator.validate(this.current);
            }
        }
    },
    session: {
        progressText: ['string', false, 'games completed']
    },
    base: {
        type: 'bracket',
        initialize: function () {
            this.updater = new BracketUpdater(window.bootstrap.sportYear);
            this.validator = new BracketValidator(window.bootstrap.sportYear);
            this.generator = new BracketGenerator(window.bootstrap.sportYear);
            this.constants = new BracketData(_.extend({props: ['constants']}, window.bootstrap.sportYear)).constants;
            this.afterInit && this.afterInit();
        },
        updateGame: function (data) {
            data.currentMaster = this.current;
            var update = this.updater.update(data);

            if (update instanceof Error) {
                this.trigger('invalid', this, update);
            } else if (update !== this.current) {
                this.updateBracket(update);
            }
        }
    }
};

module.exports = function (options) {
    options || (options = {});
    _.defaults(options, {
        history: true
    });
    return _.extend({}, definition.base, options.history ? historyDefinition.base : {}, options.base || {}, {
        session: _.extend({}, definition.session, options.history ? historyDefinition.session : {}, options.session || {}),
        derived: _.extend({}, definition.derived, options.history ? historyDefinition.derived : {}, options.derived || {})
    });
};