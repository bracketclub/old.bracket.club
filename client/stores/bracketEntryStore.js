let extend = require('lodash/object/extend');

let alt = require('../alt');
let bracketEntryActions = require('../actions/bracketEntryActions');
let concatOrInsert = require('../helpers/arrayConcatOrInsert');

let {activeYear: year, activeSport: sport} = require('../global');
let {generate, update, emptyBracket} = require('../helpers/bracket')({sport, year});


class BracketEntryStore {
    constructor () {
        this.bindActions(bracketEntryActions);

        this.index = 0;
        this.history = [emptyBracket];
    }

    onUpdateBracket (bracket) {
        let {arr, index} = concatOrInsert(this.history, bracket, this.index);
        this.history = arr;
        this.index = index;
    }

    onReset () {
        this.index = 0;
        this.history = [emptyBracket];
    }

    onGenerate (method) {
        this.onUpdateBracket(generate(method));
    }

    onUpdateGame (game) {
        let updateData = extend({currentMaster: this.history[this.index]}, game);
        this.onUpdateBracket(update(updateData));
    }

    onGetPrevious () {
        this.index = Math.max(0, this.index - 1);
    }

    onGetNext () {
        this.index = Math.min(this.index + 1, this.history.length - 1);
    }

    onGetFirst () {
        this.index = 0;
    }

    onGetLast () {
        this.index = this.history.length - 1;
    }
}

module.exports = alt.createStore(BracketEntryStore, 'BracketEntryStore');
