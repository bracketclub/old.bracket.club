'use strict';

const alt = require('../alt');
const groupBy = require('lodash/collection/groupBy');
const entryActions = require('../actions/entryActions');
const indexBy = require('lodash/collection/indexBy');
const zipObject = require('lodash/array/zipObject');
const merge = require('lodash/object/merge');
const pick = require('lodash/object/pick');
const uniq = require('lodash/array/uniq');
const {years} = require('../global');

class EntryStore {
  constructor() {
    this.bindActions(entryActions);

      // {2014: {1: entry, 2: entry}, 2015: {1: entry}}
    this.entries = zipObject(years.map((year) => [year, {}]));

      // {1: {...entry, years: ['2014', '2015']}, 2: {...entry, years: ['2014']}}
    this.users = {};

    this.loading = false;
    this.error = null;
  }

  onAddEntry(entry) {
    this.entries[entry.year][entry.user_id] = entry;
    const entryYears = ((this.users[entry.user_id] || {}).years || []).slice(0);
    this.users[entry.user_id] = this._pickUser(entry);
    this.users[entry.user_id].years = uniq(entryYears.concat(entry.year));
  }

  _pickUser(entry) {
    return pick(entry, 'user_id', 'username', 'name', 'profile_pic');
  }

  onReceiveEntries(entries) {
    const byYear = groupBy(entries, 'year');

    years.forEach((year) => {
      const yearEntries = byYear[year] ? indexBy(byYear[year], 'user_id') : {};
      this.entries[year] = yearEntries;

      merge(this.users, yearEntries, (entry, nextEntry) => {
        const nextUser = this._pickUser(nextEntry);
        nextUser.years = (entry && entry.years || []).concat(nextEntry.year);
        return nextUser;
      });
    });
  }

  onLoading(state) {
    this.loading = state;
  }

  onError(err) {
    this.error = err;
  }
}

module.exports = alt.createStore(EntryStore, 'EntryStore');
