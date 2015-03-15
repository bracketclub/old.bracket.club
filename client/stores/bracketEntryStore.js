let extend = require('lodash/object/extend');

let alt = require('../alt');
let bracketEntryActions = require('../actions/bracketEntryActions');
let concatOrInsert = require('../helpers/arrayConcatOrInsert');

let routerContainer = require('../routerContainer');
let {activeYear: year, activeSport: sport} = require('../global');
let {generate, update, emptyBracket} = require('../helpers/bracket')({sport, year});


class BracketEntryStore {
    constructor () {
        this.bindActions(bracketEntryActions);

        this.index = 0;
        this.history = [emptyBracket];
    }

    _replaceBracketUrl () {
        let {history, index} = this;
        let path = history[index];
        setTimeout(() => routerContainer.get().replaceWith('landing', {path}), 0);
    }

    onUpdateBracket (bracket) {
        let {arr, index} = concatOrInsert(this.history, bracket, this.index);
        this.history = arr;
        this.index = index;
        this._replaceBracketUrl();
    }

    onReset () {
        this.index = 0;
        this.history = [emptyBracket];
        this._replaceBracketUrl();
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
        this._replaceBracketUrl();
    }

    onGetNext () {
        this.index = Math.min(this.index + 1, this.history.length - 1);
        this._replaceBracketUrl();
    }

    onGetFirst () {
        this.index = 0;
        this._replaceBracketUrl();
    }

    onGetLast () {
        this.index = this.history.length - 1;
        this._replaceBracketUrl();
    }
}

module.exports = alt.createStore(BracketEntryStore, 'BracketEntryStore');
