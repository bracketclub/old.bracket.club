let alt = require('../alt');
let groupBy = require('lodash/collection/groupBy');
let entryActions = require('../actions/entryActions');
let indexBy = require('lodash/collection/indexBy');
let zipObject = require('lodash/array/zipObject');
let merge = require('lodash/object/merge');
let pick = require('lodash/object/pick');
let {years} = require('../global');


class EntryStore {
    constructor () {
        this.bindActions(entryActions);

        // {2014: {1: entry, 2: entry}, 2015: {1: entry}}
        this.entries = zipObject(years.map(year => [year, {}]));

        // {1: {...entry, years: ['2014', '2015']}, 2: {...entry, years: ['2014']}}
        this.users = {};
    }

    onAddEntry (entry) {
        this.entries[entry.year][entry.user_id] = entry;
    }

    onReceiveEntries (entries) {
        let byYear = groupBy(entries, 'year');

        years.forEach(year => {
            let yearEntries = byYear[year] ? indexBy(byYear[year], 'user_id') : {};
            this.entries[year] = yearEntries;
            merge(this.users, yearEntries, (entry, nextEntry) => {
                let nextUser  = pick(nextEntry, 'user_id', 'username', 'name', 'profile_pic');
                nextUser.years = (entry && entry.years || []).concat(nextEntry.year);
                return nextUser;
            });
        });
    }
}

module.exports = alt.createStore(EntryStore, 'EntryStore');
