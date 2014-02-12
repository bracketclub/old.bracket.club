var HumanModel = require('human-model');
var BracketValidator = require('bracket-validator');
var bd = new BracketValidator({year: '2013'});
var BracketUpdater = require('bracket-updater');
var _ = require('underscore');

module.exports = HumanModel.define({
    type: 'bracket',
    session: {
        historyIndex: ['number', true, 0],
        history: ['array', true, [bd.constants.EMPTY]]
    },
    derived: {
        complete: {
            deps: ['current'],
            cache: true,
            fn: function () {
                return this.current.indexOf(bd.constants.UNPICKED_MATCH) === -1;
            }
        },
        progressNow: {
            deps: ['current', 'progressTotal'],
            cache: true,
            fn: function () {
                return this.progressTotal - this.current.replace(new RegExp('[^' + bd.constants.UNPICKED_MATCH + ']', 'gi'), '').length;
            }
        },
        progressTotal: {
            deps: [],
            cache: true,
            fn: function () {
                return ((bd.constants.TEAMS_PER_REGION * bd.constants.REGION_COUNT) - 1);
            }
        },
        percent: {
            deps: ['progressTotal', 'progressNow'],
            cache: true,
            fn: function () {
                return  (this.progressNow / this.progressTotal) * 100;
            }
        },
        validated: {
            deps: ['current'],
            cache: true,
            fn: function () {
                return new BracketValidator({year: '2013', flatBracket: this.current}).validate();
            }
        },
        ordered: {
            deps: ['validated'],
            cache: true,
            fn: function () {
                var v = this.validated;
                var f = v[bd.constants.FINAL_ID];
                var first = v[bd.constants.REGION_IDS[0]];
                var second = v[first.sameSideAs];
                var others = _.reject(v, function (r) { return _.contains([f.id, first.id, second.id], r.id); });
                return [first, v[first.sameSideAs], others[0], others[1], f];
            }
        },
        current: {
            deps: ['history', 'historyIndex'],
            cache: true,
            fn: function () {
                return this.history[this.historyIndex];
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
        }
    },
    updateBracket: function (bracket) {
        if (this.canFastForward) {
            this.history = this.history.slice(0, this.historyIndex + 1).concat(bracket);
        } else {
            this.history.push(bracket);
        }
        this.historyIndex = this.history.length - 1;
    },
    updateGame: function (winner, loser, region) {
        var data = {
            winner: winner,
            fromRegion: region,
            currentMaster: this.current,
            year: '2013'
        };
        loser && (data.loser = loser);
        var update = new BracketUpdater(data).update();

        if (!(update instanceof Error) && update !== this.current) {
            this.updateBracket(update);
        }
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
    reset: function () {
        this.historyIndex = 0;
        this.history = [bd.constants.EMPTY];
    }
});
