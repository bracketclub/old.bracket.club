'use strict';

const log = require('bows')('meStore');
const alt = require('../alt');
const meActions = require('../actions/meActions');

class MeStore {
  constructor() {
    this.bindActions(meActions);

    this.id = null;
    this.username = null;
  }

  onError(err) {
    log('[AUTH]', err);
  }

  onLogout() {
    this.id = null;
    this.username = null;
  }

  onLogin(obj) {
    const twitter = obj && obj.twitter;
    if (twitter) {
      this.id = twitter.id;
      this.username = twitter.username;
    }
      else {
      this.onLogout();
    }
  }
}

module.exports = alt.createStore(MeStore, 'MeStore');
