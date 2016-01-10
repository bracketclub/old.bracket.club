'use strict';

const globalDataStore = require('./globalDataStore');
const indexBy = require('lodash/collection/indexBy');
const zipObject = require('lodash/array/zipObject');

const alt = require('../alt');
const masterActions = require('../actions/masterActions');
const {years, activeYear} = require('../global');
const bracketHelpers = require('../helpers/bracket');

class MasterStore {
  constructor() {
    this.bindActions(masterActions);

    this.index = 0;
    this.loading = false;
    this.error = null;

    this.on('bootstrap', () => {
      const {sport} = globalDataStore.getState();
          // {2014: [...brackets], 2015: [...brackets]}
      this.history = zipObject(years.map((year) =>
        [year, [bracketHelpers({sport, year}).emptyBracket]]
      ));
    });
  }

  _getCurrentHistory() {
    this.waitFor(globalDataStore.dispatchToken);
    const {year} = globalDataStore.getState();
    return this.history[year];
  }

  _getLastIndex() {
    return this._getCurrentHistory().length - 1;
  }

  onReceiveMasters(masters) {
    this.waitFor(globalDataStore.dispatchToken);
    const {sport} = globalDataStore.getState();

    const byYear = indexBy(masters, 'year');
    years.forEach((year) => {
      const {brackets} = byYear[year] || {};
      this.history[year] = [bracketHelpers({sport, year}).emptyBracket].concat(brackets || []);
    });

    this.index = this._getLastIndex();
  }

  onAddMaster(master) {
      // Masters will only be added to the current year
    this.history[activeYear].push(master.master);
    this.index = this.history[activeYear].length - 1;
  }

  onGetPrevious() {
    this.index = Math.max(0, this.index - 1);
  }

  onGetNext() {
    this.index = Math.min(this.index + 1, this._getLastIndex());
  }

  onGetFirst() {
    this.index = 0;
  }

  onGetLast() {
    this.index = this._getLastIndex();
  }

  onGetIndex(index) {
    this.index = Math.min(Math.max(0, index), this._getLastIndex());
  }

  onLoading(state) {
    this.loading = state;
  }

  onError(err) {
    this.error = err;
  }
}

module.exports = alt.createStore(MasterStore, 'MasterStore');
