let alt = require('../alt');


class MasterActions {
    constructor () {
        this.generateActions(
            'addMaster',
            'getFirst',
            'getLast',
            'getNext',
            'getPrevious'
        );
    }
}

module.exports = alt.createActions(MasterActions);
