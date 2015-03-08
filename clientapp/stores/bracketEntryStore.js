let alt = require('../alt');
let bracketEntryActions = require('../actions/bracketEntryActions');
let globalDataStore = require('./globalDataStore');
let extend = require('lodash/object/extend');
let concatOrInsert = require('../helpers/arrayConcatOrInsert');


class BracketEntryStore {
    constructor () {
        this.bindActions(bracketEntryActions);

        this.on('bootstrap', this._resetToEmpty);
    }

    static getBracket () {
        let {history, index} = this.getState();
        return history[index];
    }

    _resetToEmpty () {
        let {emptyBracket} = globalDataStore.getState();
        this.index = 0;
        this.history = [emptyBracket];
    }

    onUpdateBracket (bracket) {
        let {arr, index} = concatOrInsert(this.history, bracket, this.index);
        this.history = arr;
        this.index = index;
    }

    onReset () {
        this.waitFor(globalDataStore.dispatchToken);
        this._resetToEmpty();
    }

    onGenerate (method) {
        this.waitFor(globalDataStore.dispatchToken);
        let {generator} = globalDataStore.getState();
        this.onUpdateBracket(generator.generate(method));
    }

    onUpdateGame (game) {
        this.waitFor(globalDataStore.dispatchToken);
        let {updater} = globalDataStore.getState();
        let updateData = extend({currentMaster: this.history[this.index]}, game);
        this.onUpdateBracket(updater.update(updateData));
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
