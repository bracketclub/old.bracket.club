let alt = require('../alt');


class EntryActions {
    constructor () {
        this.generateActions('addEntry');
    }
}

module.exports = alt.createActions(EntryActions);
