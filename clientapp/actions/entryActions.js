let alt = require('../alt');
let xhr = require('xhr');
let API_URL = 'http://localhost:3001';


class EntryActions {
    constructor () {
        this.generateActions('addEntry', 'receiveEntries');
    }

    fetchEntries () {
        xhr({
            url: API_URL + '/entries',
        }, (err, resp, body) => {
            if (err) {
                console.error(err);
            } else {
                this.actions.receiveEntries(JSON.parse(body).response);
            }
        });
    }
}

module.exports = alt.createActions(EntryActions);
