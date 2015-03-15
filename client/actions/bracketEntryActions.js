let alt = require('../alt');


class BracketEntryActions {
    constructor () {
        this.generateActions(
            'updateBracket',
            'updateGame',
            'getFirst',
            'getLast',
            'getNext',
            'getPrevious',
            'generate',
            'reset'
        );
    }
}

module.exports = alt.createActions(BracketEntryActions);
