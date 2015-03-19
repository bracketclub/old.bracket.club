let alt = require('../alt');
let api = require('../helpers/api');
let eventSource = require('../helpers/eventSource');


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
        api('/masters', (masters) => {
            eventSource('/masters/events', (data) => this.actions.addMaster(data));
            this.actions.receiveMasters(masters);
        });
    }
}

module.exports = alt.createActions(MasterActions);
