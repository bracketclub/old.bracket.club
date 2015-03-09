let alt = require('../alt');
let api = require('../helpers/api');


class EntryActions {
    constructor () {
        this.generateActions('addEntry', 'receiveEntries');
    }

    fetchEntries () {
        api('/entries', this.actions.receiveEntries);
    }
}

module.exports = alt.createActions(EntryActions);
