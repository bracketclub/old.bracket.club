'use strict';

let alt = require('../alt');
let {firebase} = require('../global');


class MasterActions {
    constructor () {
        this.generateActions('login', 'error');
    }

    logout () {
        firebase.unauth();
    }

    auth () {
        // The main file creates a firebase auth listener so
        // all we need to do here is start the flow and catch the error
        firebase.authWithOAuthPopup('twitter', (err) => {
            if (err) {
                this.actions.error(err);
            }
        });
    }
}

module.exports = alt.createActions(MasterActions);
