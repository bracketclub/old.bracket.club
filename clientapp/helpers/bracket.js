var _ = require('underscore');


module.exports = {
    derived: {
        current: {
            deps: ['history', 'historyIndex'],
            cache: true,
            fn: function () {
                return this.history[this.historyIndex];
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
            deps: ['current'],
            cache: true,
            fn: function () {
                return this.history.length > 0 && this.historyIndex > 0;
            }
        },
        canFastForward: {
            deps: ['current'],
            cache: true,
            fn: function () {
                return this.history.length > 0 && this.historyIndex < this.history.length - 1;
            }
        },
        hasHistory: {
            deps: ['current'],
            cache: true,
            fn: function () {
                return this.history.length > 1;
            }
        },
        needsEmptyBase: {
            deps: ['current'],
            cache: true,
            fn: function () {
                return !this.hasHistory || this.history[0] !== this.constants.EMPTY;
            }
        }
    },
    methods: {
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
        reset: function () {
            this.historyIndex = 0;
            this.history = [this.constants.EMPTY];
        },
        setEmptyBase: function () {
            this.history.unshift(this.constants.EMPTY);
            this.history.length === 1 ? this.historyIndex = 0 : this.historyIndex++;
        }
    }
};