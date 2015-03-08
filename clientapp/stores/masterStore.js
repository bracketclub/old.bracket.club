let alt = require('../alt');
let masterActions = require('../actions/masterActions');
let globalDataStore = require('./globalDataStore');


class MasterStore {
    constructor () {
        this.bindActions(masterActions);

        this.index = 0;
        this.history = [];

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

    onReceiveMasters (masters) {
        this.waitFor(globalDataStore.dispatchToken);
        let {emptyBracket} = globalDataStore.getState();
        this.history = [emptyBracket].concat(masters);
        this.index = this.history.length - 1;
    }

    onAddMaster (master) {
        this.history.push(master);
        this.index = this.history.length - 1;
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

    onGetIndex (index) {
        this.index = Math.min(Math.max(0, index), this.history.length - 1);
    }
}

module.exports = alt.createStore(MasterStore, 'MasterStore');
