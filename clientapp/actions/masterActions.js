let alt = require('../alt');


class MasterActions {
    constructor () {
        this.generateActions(
            'addMaster',
            'getFirst',
            'getLast',
            'getNext',
            'getPrevious',
            'getIndex'
        );
    }
}

module.exports = alt.createActions(MasterActions);
