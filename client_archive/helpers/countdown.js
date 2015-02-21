var State = require('ampersand-state');
var moment = require('moment');
var raf = require('raf');
var bind = require('lodash/function/bind');


module.exports = State.extend({
    initialize: function () {
        if (this.diff > 0 || !this.stopAtZero) {
            this.countdown();
        }
    },
    session: {
        time: ['string', true, ''],
        now: ['object', true, function () { return moment() ;}],
        stopAtZero: ['boolean', true, true]
    },
    derived: {
        moment: {
            deps: ['time'],
            fn: function () {
                return moment(this.time);
            }
        },
        diff: {
            deps: ['moment', 'now'],
            fn: function () {
                return this.moment.diff(this.now);
            }
        },
        isBefore: {
            deps: ['moment', 'now'],
            fn: function () {
                return this.now.isBefore(this.moment);
            }
        },
        fromNow: {
            deps: ['moment', 'now'],
            fn: function () {
                return this.moment.fromNow();
            }
        }
    },
    countdown: function () {
        this.now = moment();
        if (this.diff < 0 && this.countdownId && this.stopAtZero) {
            raf.cancel(this.countdownId);
        } else {
            this.countdownId = raf(bind(this.countdown, this));
        }
    }
});
