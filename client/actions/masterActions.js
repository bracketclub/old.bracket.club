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

    fetchMasters (options) {
        api('/masters', (masters) => {
            if (options.stream) {
                eventSource('/masters/events', 'masters', this.actions.addMaster);
            }
            this.actions.receiveMasters(masters);
        });
    }
}

module.exports = alt.createActions(MasterActions);
