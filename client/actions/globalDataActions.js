'use strict';

let alt = require('../alt');


class GlobalDataActions {
    constructor () {
        this.generateActions('updateLocked', 'updateYear');
    }
}

module.exports = alt.createActions(GlobalDataActions);
