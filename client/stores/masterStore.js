let globalDataStore = require('./globalDataStore');
let indexBy = require('lodash/collection/indexBy');
let zipObject = require('lodash/array/zipObject');

let alt = require('../alt');
let masterActions = require('../actions/masterActions');
let {years, activeYear} = require('../global');
let bracketHelpers = require('../helpers/bracket');



class MasterStore {
    constructor () {
        this.bindActions(masterActions);

        this.index = 0;

        this.on('bootstrap', () => {
            let {sport} = globalDataStore.getState();
            // {2014: [...brackets], 2015: [...brackets]}
            this.history = zipObject(years.map(year =>
                [year, [bracketHelpers({sport, year}).emptyBracket]]
            ));
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
        let {sport} = globalDataStore.getState();

        let byYear = indexBy(masters, 'year');
        years.forEach(year => {
            let {brackets} = byYear[year] || {};
            this.history[year] = [bracketHelpers({sport, year}).emptyBracket].concat(brackets || []);
        });

        this.index = this._getLastIndex();
    }

    onAddMaster (master) {
        // Masters will only be added to the current year
        this.history[activeYear].push(master.master);
        this.index = this.history[activeYear].length - 1;
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
