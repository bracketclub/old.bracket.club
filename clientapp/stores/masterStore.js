let alt = require('../alt');
let masterActions = require('../actions/masterActions');


class MasterStore {
    constructor () {
        this.bindActions(masterActions);

        this.index = 0;
        this.brackets = [];

        this.on('bootstrap', () => {
            this.index = this.brackets.length - 1;
        });
    }

    static getBracket () {
        var bracket = this.brackets[this.index];
        return {bracket};
    }

    onAddMaster (master) {
        this.brackets.push(master);
        this.index = this.brackets.length - 1;
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
        this.index = this.brackets.length - 1;
    }
}

module.exports = alt.createStore(MasterStore, 'MasterStore');
