var HumanModel = require('human-model');
var moment = require('moment');
var _ = require('underscore');


module.exports = HumanModel.define({
    initialize: function () {
        if (this.closesIn > 0) {
            this.countdown();
        }
    },
    session: {
        locks: ['string', true, ''],
        now: ['object', true, moment()]
    },
    derived: {
        momentLock: {
            deps: ['locks'],
            cache: true,
            fn: function () {
                return moment(this.locks);
            }
        },
        closesIn: {
            deps: ['momentLock', 'now'],
            cache: true,
            fn: function () {
                return this.momentLock.diff(this.now);
            }
        },
        isPickable: {
            deps: ['momentLock', 'now'],
            cache: true,
            fn: function () {
                return this.now.isBefore(this.momentLock);
            }
        },
        timeToClose: {
            deps: ['momentLock', 'now'],
            cache: true,
            fn: function () {
                return this.momentLock.fromNow();
            }
        }
    },
    countdown: function () {
        this.now = moment();
        if (this.closesIn < 0 && this.countdownId) {
            window.cancelAnimationFrame(this.countdownId);
        } else {
            this.countdownId = window.requestAnimationFrame(_.bind(this.countdown, this));
        }
    }
});
