let alt = require('../alt');
let meActions = require('../actions/meActions');


class MeStore {
    constructor () {
        this.bindActions(meActions);

        this.id = null;
        this.username = null;
    }

    onError (err) {
        console.error('[AUTH]', err);
    }

    onLogout () {
        this.id = null;
        this.username = null;
    }

    onLogin (obj) {
        let twitter = obj && obj.twitter;
        if (twitter) {
            this.id = twitter.id;
            this.username = twitter.username;
        } else {
            this.onLogout();
        }
    }
}

module.exports = alt.createStore(MeStore, 'MeStore');
