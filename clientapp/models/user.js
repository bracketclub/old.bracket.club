var HumanModel = require('human-model');
var BracketScorer = require('bracket-scorer');
var _ = require('underscore');
var bd = new BracketScorer({year: '2013'});


module.exports = HumanModel.define({
    type: 'user',
    session: {
        bracket: ['string', true, ''],
        username: ['string', true, ''],
        masters: ['array', true, []],
        masterIndex: ['number', true, 0]
    },
    derived: {
        score: {
            deps: ['bracket', 'masterIndex'],
            cache: true,
            fn: function () {
                return new BracketScorer({
                    userBracket: this.bracket,
                    masterBracket: this.masters[this.masterIndex],
                    year: '2013'
                }).getScore();
            }
        },
        gooley: {
            deps: ['bracket', 'masterIndex'],
            cache: true,
            fn: function () {
                return new BracketScorer({
                    userBracket: this.bracket,
                    masterBracket: this.masters[this.masterIndex],
                    year: '2013'
                }).gooley().gooley;
            }
        },
        diff: {
            deps: ['bracket', 'masterIndex'],
            cache: true,
            fn: function () {
                return new BracketScorer({
                    userBracket: this.bracket,
                    masterBracket: this.masters[this.masterIndex],
                    year: '2013'
                }).diff();
            }
        },
        ordered: {
            deps: ['diff'],
            cache: true,
            fn: function () {
                var v = this.diff;
                var f = v[bd.constants.FINAL_ID];
                var first = v[bd.constants.REGION_IDS[0]];
                var second = v[first.sameSideAs];
                var others = _.reject(v, function (r) { return _.contains([f.id, first.id, second.id], r.id); });
                return [first, v[first.sameSideAs], others[0], others[1], f];
            }
        },
        canRewind: {
            deps: ['masters', 'masterIndex'],
            cache: true,
            fn: function () {
                return this.masters.length > 0 && this.masterIndex > 0;
            }
        },
        canFastForward: {
            deps: ['masters', 'masterIndex'],
            cache: true,
            fn: function () {
                return this.masters.length > 0 && this.masterIndex < this.masters.length - 1;
            }
        },
        progressNow: {
            deps: ['masterIndex'],
            cache: true,
            fn: function () {
                return this.masterIndex;
            }
        },
        progressTotal: {
            deps: ['masters'],
            cache: true,
            fn: function () {
                return this.masters.length - 1;
            }
        },
        percent: {
            deps: ['progressTotal', 'progressNow'],
            cache: true,
            fn: function () {
                return  (this.progressNow / this.progressTotal) * 100;
            }
        },
    },
    previous: function () {
        this.masterIndex = Math.max(0, this.masterIndex - 1);
    },
    next: function () {
        this.masterIndex = Math.min(this.masterIndex + 1, this.masters.length - 1);
    },
    first: function () {
        this.masterIndex = 0;
    },
    last: function () {
        this.masterIndex = this.masters.length - 1;
    }
});
