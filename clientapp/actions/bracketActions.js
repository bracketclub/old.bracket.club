let alt = require('../alt');


class BracketActions {
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

module.exports = alt.createActions(BracketActions);
