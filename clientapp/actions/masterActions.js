let alt = require('../alt');
let xhr = require('xhr');
let API_URL = 'http://localhost:3001';


class MasterActions {
    constructor () {
        this.generateActions(
            'addMaster',
            'getFirst',
            'getLast',
            'getNext',
            'getPrevious',
            'getIndex',
            'receiveMasters'
        );
    }

    fetchMasters () {
        xhr({
            url: API_URL + '/masters',
        }, (err, resp, body) => {
            if (err) {
                console.error(err);
            } else {
                this.actions.receiveMasters(JSON.parse(body).response);
            }
        });
    }
}

module.exports = alt.createActions(MasterActions);
