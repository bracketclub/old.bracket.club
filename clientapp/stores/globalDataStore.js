let alt = require('../alt');
let globalDataActions = require('../actions/globalDataActions');

let Countdown = require('../helpers/countdown');
let bracketHelpers = require('../helpers/bracket');


class GlobalDataStore {
    constructor () {
        this.bindActions(globalDataActions);

        this.sport = '';
        this.year = '';
        this.locked = false;

        this.on('bootstrap', () => {
            this._updateSportYear({sport: this.sport, year: this.year});
        });
    }

    _updateSportYear (obj) {
        let {sport, year} = obj;
        this.sport = sport;
        this.year = year;
        this._updateLocked();
    }

    // This will lock the store once the countdown to the bracketData locks
    // time has expired. If the time is already expired, then the callback
    // will be called synchronously.
    _updateLocked () {
        this._countdown && this._countdown.cancel();
        let {locks} = bracketHelpers({sport: this.sport, year: this.year});
        this._countdown = new Countdown(locks, () => {
            this.onUpdateLocked(true);
        });
        if (this._countdown._id) {
            this.onUpdateLocked(false);
        }
    }

    onUpdateYear (year) {
        this._updateSportYear({sport: this.sport, year});
    }

    onUpdateLocked (locked) {
        this.locked = locked;
    }
}

module.exports = alt.createStore(GlobalDataStore, 'GlobalDataStore');
