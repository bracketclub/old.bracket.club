'use strict';

let alt = require('../alt');
let api = require('../helpers/api');
let eventSource = require('../helpers/eventSource');


class EntryActions {
    constructor () {
        this.generateActions(
            'addEntry',
            'receiveEntries',
            'loading',
            'error'
        );
    }

    fetchEntries (options) {
        this.actions.loading(true);
        api('/entries', (err, entries) => {
            this.actions.loading(false);
            if (err) {
                this.actions.error(err);
            }
            else {
                if (options.stream) {
                    eventSource('/entries/events', 'entries', this.actions.addEntry);
                }
                this.actions.receiveEntries(entries);
            }
        });
    }
}

module.exports = alt.createActions(EntryActions);
