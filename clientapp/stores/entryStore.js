let alt = require('../alt');
let entryActions = require('../actions/entryActions');


class EntryStore {
    constructor () {
        this.bindActions(entryActions);

        this.entries = {};
    }

    onAddEntry (entry) {
        this.entries[entry.username] = entry;
    }
}

module.exports = alt.createStore(EntryStore, 'EntryStore');
