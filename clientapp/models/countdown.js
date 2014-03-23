var HumanModel = require('human-model');
var moment = require('moment');
var _ = require('underscore');


module.exports = HumanModel.define({
    initialize: function () {
        if (this.diff > 0 || !this.stopAtZero) {
            this.countdown();
        }
    },
    session: {
        time: ['string', true, ''],
        now: ['object', true, moment()],
        stopAtZero: ['boolean', true, true]
    },
    derived: {
        moment: {
            deps: ['time'],
            cache: true,
            fn: function () {
                return moment(this.time);
            }
        },
        diff: {
            deps: ['moment', 'now'],
            cache: true,
            fn: function () {
                return this.moment.diff(this.now);
            }
        },
        isBefore: {
            deps: ['moment', 'now'],
            cache: true,
            fn: function () {
                return this.now.isBefore(this.moment);
            }
        },
        fromNow: {
            deps: ['moment', 'now'],
            cache: true,
            fn: function () {
                return this.moment.fromNow();
            }
        }
    },
    countdown: function () {
        this.now = moment();
        if (this.diff < 0 && this.countdownId && this.stopAtZero) {
            window.cancelAnimationFrame(this.countdownId);
        } else {
            this.countdownId = window.requestAnimationFrame(_.bind(this.countdown, this));
        }
    }
});
