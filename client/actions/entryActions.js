let alt = require('../alt');
let api = require('../helpers/api');
let eventSource = require('../helpers/eventSource');


class EntryActions {
    constructor () {
        this.generateActions('addEntry', 'receiveEntries');
    }

    fetchEntries (options) {
        api('/entries', (entries) => {
            if (options.stream) {
                eventSource('/entries/events', 'entries', this.actions.addEntry);
            }
            this.actions.receiveEntries(entries);
        });
    }
}

module.exports = alt.createActions(EntryActions);
