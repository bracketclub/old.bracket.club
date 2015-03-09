let alt = require('../alt');
let firebase = require('../helpers/firebase');


class MasterActions {
    constructor () {
        this.generateActions('login', 'logout', 'error');
    }

    auth () {
        firebase.authWithOAuthPopup('twitter', (err, authData) => {
            if (err) {
                this.actions.error(err);
            } else {
                this.actions.login(authData);
            }
        });
    }
}

module.exports = alt.createActions(MasterActions);
