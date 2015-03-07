let alt = require('../alt');
let masterActions = require('../actions/masterActions');


class MasterStore {
    constructor () {
        this.bindActions(masterActions);

        this.index = 0;
        this.history = [];
    }

    static getBracket () {
        let {history, index} = this.getState();
        return history[index];
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
