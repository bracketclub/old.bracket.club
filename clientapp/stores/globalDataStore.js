let alt = require('../alt');
let last = require('lodash/array/last');
let globalDataActions = require('../actions/globalDataActions');
let BracketUpdater = require('bracket-updater');
let BracketGenerator = require('bracket-generator');
let BracketValidator = require('bracket-validator');
let BracketData = require('bracket-data');
let BracketScorer = require('bracket-scorer');
let Countdown = require('../helpers/countdown');
let {years} = require('../global');


class GlobalDataStore {
    constructor () {
        this.bindActions(globalDataActions);

        this.sport = '';
        this.year = '';
        this.activeYear = '';
        this.locked = false;
        this.bracketData = {};

        this.on('bootstrap', () => {
            // activeYear is static and determins which stores get realtime data added to them
            this.activeYear = last(years);
            this.onUpdateSportYear({sport: this.sport, year: this.year});
        });
    }

    onUpdateSportYear (obj) {
        let {sport, year} = obj;
        this.sport = sport;
        this.year = years.indexOf(year) > -1 ? year : last(years);
        this.bracketData = new BracketData({props: ['constants', 'locks'], sport, year});
        this.emptyBracket = this.bracketData.constants.EMPTY;
        this.validator = new BracketValidator({sport, year});
        this.updater = new BracketUpdater({sport, year});
        this.generator = new BracketGenerator({sport, year});
        this.scorer = new BracketScorer({sport, year});
        this.countdown();
    }

    onUpdateYear (year) {
        this.onUpdateSportYear({sport: this.sport, year});
    }

    onUpdateLocked (locked) {
        this.locked = locked;
    }

    // This will lock the store once the countdown to the bracketData locks
    // time has expired. If the time is already expired, then the callback
    // will be called synchronously.
    countdown () {
        this._countdown && this._countdown.cancel();
        this._countdown = new Countdown(this.bracketData.locks, () => {
            this.onUpdateLocked(true);
        });
        if (this._countdown._id) {
            this.onUpdateLocked(false);
        }
    }
}

module.exports = alt.createStore(GlobalDataStore, 'GlobalDataStore');
