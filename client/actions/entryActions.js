let alt = require('../alt');
let api = require('../helpers/api');
let eventSource = require('../helpers/eventSource');


class EntryActions {
    constructor () {
        this.generateActions('addEntry', 'receiveEntries');
    }

    fetchEntries () {
        api('/entries', (entries) => {
            eventSource('/entries/events', (data) => this.actions.addEntry(data));
            this.actions.receiveEntries(entries);
        });
    }
}

module.exports = alt.createActions(EntryActions);
