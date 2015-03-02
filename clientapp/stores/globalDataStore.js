let alt = require('../alt');
let globalDataActions = require('../actions/globalDataActions');
let BracketUpdater = require('bracket-updater');
let BracketGenerator = require('bracket-generator');
let BracketValidator = require('bracket-validator');
let BracketData = require('bracket-data');
let Countdown = require('../helpers/countdown');


class GlobalDataStore {
    constructor () {
        this.bindActions(globalDataActions);

        this.sport = '';
        this.year = '';
        this.locked = false;
        this.bracketData = {};

        this.on('bootstrap', () => {
            this.onUpdateSportYear({sport: this.sport, year: this.year});
        });
    }

    onUpdateSportYear (obj) {
        let {sport, year} = obj;
        this.sport = sport;
        this.year = year;
        this.bracketData = new BracketData({props: ['constants'], sport, year});
        this.validator = new BracketValidator({sport, year});
        this.updater = new BracketUpdater({sport, year});
        this.generator = new BracketGenerator({sport, year});
        this.countdown();
    }

    onUpdateYear (year) {
        this.onUpdateSportYear({sport: this.sport, year});
    }

    onUpdateSport (sport) {
        this.onUpdateSportYear({year: this.year, sport});
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
            globalDataActions.updateLocked(true);
        });
    }
}

module.exports = alt.createStore(GlobalDataStore, 'GlobalDataStore');
