let raf = require('raf');


class Countdown {
    constructor (time, callback) {
        this.date = new Date(time);
        this.callback = callback;
        this.countdown();
    }

    diff () {
        return this.date - new Date();
    }

    cancel () {
        this._id && raf.cancel(this._id);
        delete this._id;
    }

    countdown () {
        if (this.diff() < 0) {
            this.cancel();
            this.callback();
        } else {
            this._id = raf(this.countdown.bind(this));
        }
    }

}

module.exports = Countdown;
