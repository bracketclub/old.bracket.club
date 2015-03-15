let alt = require('../alt');
let api = require('../helpers/api');


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
        api('/masters', this.actions.receiveMasters);
    }
}

module.exports = alt.createActions(MasterActions);
