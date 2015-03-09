let alt = require('../alt');
let masterActions = require('../actions/masterActions');
let globalDataStore = require('./globalDataStore');
let indexBy = require('lodash/collection/indexBy');
let zipObject = require('lodash/array/zipObject');
let {years} = require('../global');


class MasterStore {
    constructor () {
        this.bindActions(masterActions);

        this.index = 0;

        // {2014: [...brackets], 2015: [...brackets]}
        this.history = zipObject(years.map(year => [year, []]));

        this.on('bootstrap', () => {
            let {emptyBracket, year} = globalDataStore.getState();
            this.index = 0;
            this.history[year] = [emptyBracket];
        });
    }

    _getCurrentHistory () {
        this.waitFor(globalDataStore.dispatchToken);
        let {year} = globalDataStore.getState();
        return this.history[year];
    }

    _getLastIndex () {
        return this._getCurrentHistory().length - 1;
    }

    onReceiveMasters (masters) {
        this.waitFor(globalDataStore.dispatchToken);
        let {emptyBracket} = globalDataStore.getState();

        let byYear = indexBy(masters, 'year');
        years.forEach(year => {
            let {brackets} = byYear[year] || {};
            this.history[year] = [emptyBracket].concat(brackets || []);
        });

        this.index = this._getLastIndex();
    }

    onAddMaster (master) {
        this.waitFor(globalDataStore.dispatchToken);
        let {activeYear} = globalDataStore.getState();

        // Masters will only be added to the current year
        this.history[activeYear].push(master);
    }

    onGetPrevious () {
        this.index = Math.max(0, this.index - 1);
    }

    onGetNext () {
        this.index = Math.min(this.index + 1, this._getLastIndex());
    }

    onGetFirst () {
        this.index = 0;
    }

    onGetLast () {
        this.index = this._getLastIndex();
    }

    onGetIndex (index) {
        this.index = Math.min(Math.max(0, index), this._getLastIndex());
    }
}

module.exports = alt.createStore(MasterStore, 'MasterStore');
